// src/services/api.ts
const API_URL = 'http://localhost:3000/graphql';

export interface Score {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
  rank: number;
  country_code: string;
}

const getPlayerIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '0.0.0.0';
  }
};

export const getHighScores = async (): Promise<Score[]> => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetHighScores {
            highScores(limit: 5) {
              id
              player_name
              score
              created_at
              rank
              country_code
            }
          }
        `
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.highScores;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

export const submitScore = async (player_name: string, score: number): Promise<Score> => {
  try {
    const ip = await getPlayerIP();
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation SubmitScore($player_name: String!, $score: Int!, $ip: String!) {
            submitScore(player_name: $player_name, score: $score, ip: $ip) {
              id
              player_name
              score
              created_at
              rank
              country_code
            }
          }
        `,
        variables: { 
          player_name, 
          score, 
          ip 
        }
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.submitScore;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};
