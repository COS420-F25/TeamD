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

/**
 * Search filters for advanced search functionality
 */
export interface SearchFilters {
  query?: string; // Text search query
  tagsInclude?: string[]; // Tags that must be included (at least one)
  tagsExclude?: string[]; // Tags that must be excluded (none of these)
  userName?: string; // Filter by user name
  dateFrom?: string; // Filter portfolios created after this date (ISO format)
  dateTo?: string; // Filter portfolios created before this date (ISO format)
  sortBy?: "relevance" | "date" | "updated" | "alphabetical"; // Sort order
  sortOrder?: "asc" | "desc"; // Sort direction
}