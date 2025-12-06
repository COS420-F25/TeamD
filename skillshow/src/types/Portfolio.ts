// src/types/Portfolio.ts

/**
 * Portfolio interface representing a user's project/portfolio
 * Used for search functionality. TypeScript needs type definitions which is added (and subject to be removed)
 */

import { Project } from "./Project";

export interface Portfolio {
  portfolioId: string;
  userId: string;
  projects: Project[];
}

/**
 * Search result type - includes portfolio and match relevance
 */
export interface SearchResult {
  project: Project;
  portfolioId: string;
  matchScore: number; // For ranking results by relevance
}