// backend/src/types.ts
export interface Score {
    id: string;
    player_name: string;
    score: number;
    created_at: string;
  }
  
  export interface QueryResolvers {
    highScores: (parent: unknown, args: { limit?: number }) => Promise<Score[]>;
  }
  
  export interface MutationResolvers {
    submitScore: (
      parent: unknown,
      args: { player_name: string; score: number }
    ) => Promise<Score>;
  }
  
  export interface Resolvers {
    Query: QueryResolvers;
    Mutation: MutationResolvers;
  }