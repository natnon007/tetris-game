// backend/src/index.ts
import { Elysia } from 'elysia';
import { createYoga, createSchema } from 'graphql-yoga';
import fetch from 'node-fetch';
import { pool, createTables, connectWithRetry } from './db';

// ฟังก์ชันเริ่มต้นเซิร์ฟเวอร์
const startServer = async () => {
  // ฟังก์ชันสำหรับดึงข้อมูลประเทศจาก IP
  async function getCountryFromIP(ip: string): Promise<string> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return data.country_code || 'UN';
    } catch (error) {
      console.error('Error fetching country:', error);
      return 'UN';
    }
  }

  // กำหนด GraphQL Schema
  const schema = createSchema({
    typeDefs: `
      type Score {
        id: ID!
        player_name: String!
        score: Int!
        created_at: String!
        rank: Int!
        country_code: String!
      }

      type Query {
        highScores(limit: Int): [Score!]!
      }

      type Mutation {
        submitScore(player_name: String!, score: Int!, ip: String!): Score!
      }
    `,
    resolvers: {
      Query: {
        highScores: async (_, { limit = 5 }) => {
          const result = await pool.query(`
            WITH RankedScores AS (
              SELECT 
                id,
                player_name,
                score,
                created_at,
                country_code,
                DENSE_RANK() OVER (
                  ORDER BY score DESC, created_at ASC
                ) as rank
              FROM ns_tetris_scores
            )
            SELECT *
            FROM RankedScores
            WHERE rank <= $1
            ORDER BY score DESC, created_at ASC
          `, [limit]);
          
          return result.rows;
        },
      },
      Mutation: {
        submitScore: async (_, { player_name, score, ip }) => {
          const countryCode = await getCountryFromIP(ip);
          
          const result = await pool.query(
            'INSERT INTO ns_tetris_scores (player_name, score, country_code) VALUES ($1, $2, $3) RETURNING *',
            [player_name, score, countryCode]
          );
          
          const rankResult = await pool.query(`
            WITH RankedScores AS (
              SELECT 
                id,
                DENSE_RANK() OVER (
                  ORDER BY score DESC, created_at ASC
                ) as rank
              FROM ns_tetris_scores
            )
            SELECT rank
            FROM RankedScores
            WHERE id = $1
          `, [result.rows[0].id]);

          return {
            ...result.rows[0],
            rank: rankResult.rows[0].rank
          };
        },
      },
    },
  });

  // สร้าง GraphQL Yoga server
  const yoga = createYoga({
    schema,
    graphiql: true,
    cors: {
      origin: ['*'],
      credentials: true,
      allowedHeaders: ['content-type']
    }
  });

  // สร้าง Elysia server
  const app = new Elysia()
    .all('/graphql', ({ request }) => {
      return yoga.handle({
        request,
        headers: request.headers,
        method: request.method,
        query: new URL(request.url).searchParams,
        body: request.body
      });
    })
    .listen(3000);

  console.log(`🚀 Server is running at http://localhost:${app.server?.port}/graphql`);
  return app;
};

// ฟังก์ชันเริ่มต้นระบบ
const initialize = async () => {
  try {
    console.log('Attempting to connect to database...');
    // พยายามเชื่อมต่อฐานข้อมูลด้วยการ retry (20 ครั้ง, ทุก 5 วินาที)
    await connectWithRetry(20, 5000);

    console.log('Creating database tables...');
    await createTables();
    
    console.log('Starting server...');
    await startServer();

  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
};

// จัดการ process signals
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing pool and exiting...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing pool and exiting...');
  await pool.end();
  process.exit(0);
});

// เริ่มต้นระบบ
initialize().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});