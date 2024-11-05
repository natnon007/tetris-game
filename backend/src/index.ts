// backend/src/index.ts
import { Elysia } from 'elysia';
import { createYoga, createSchema } from 'graphql-yoga';
import fetch from 'node-fetch';
import { pool, createTables, testConnection } from './db';

// ทดสอบการเชื่อมต่อและสร้างตาราง
const initializeDatabase = async () => {
  try {
    await testConnection();
    await createTables();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// เริ่มต้นฐานข้อมูล
initializeDatabase();

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
            FROM scores
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
          'INSERT INTO scores (player_name, score, country_code) VALUES ($1, $2, $3) RETURNING *',
          [player_name, score, countryCode]
        );
        
        const rankResult = await pool.query(`
          WITH RankedScores AS (
            SELECT 
              id,
              DENSE_RANK() OVER (
                ORDER BY score DESC, created_at ASC
              ) as rank
            FROM scores
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
    origin: ['http://ec2-3-7-254-26.ap-south-1.compute.amazonaws.com:5173'],
    credentials: false,
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
  .listen({
    port: 3000,
    hostname: '0.0.0.0' // ให้ฟังทุกอินเทอร์เฟซ
  });

console.log(`🚀 Server is running at http://localhost:${app.server?.port}/graphql`);
