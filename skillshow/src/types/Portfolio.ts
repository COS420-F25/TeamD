// src/types/Portfolio.ts

/**
 * Portfolio interface representing a user's project/portfolio
 * Used for search functionality. TypeScript needs type definitions which is added (and subject to be removed)
 */
export interface Portfolio {
  portfolioId: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

/**
 * Search result type - includes portfolio and match relevance
 */
export interface SearchResult {
  portfolio: Portfolio;
  matchScore: number; // For ranking results by relevance
}