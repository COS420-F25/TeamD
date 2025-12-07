// src/services/SearchService.ts

import { Portfolio, SearchResult } from "../types/Portfolio";
import { Project } from "../types/Project";

// Local search filters interface (kept local to avoid changing shared types)
export interface SearchFilters {
  query?: string;
  tagsInclude?: string[]; // at least one of these tags must be present on the project
  tagsExclude?: string[]; // none of these tags may be present on the project
  userId?: string; // project owner id
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  sortBy?: "relevance" | "date" | "alphabetical";
  sortOrder?: "asc" | "desc";
}

/**
 * SearchService handles project search functionality
 * 
 * Architecture:
 * - Portfolio is a container that holds multiple Projects
 * - Search operates on individual Projects within Portfolios
 * - Results include both the Project and its parent Portfolio reference
 * 
 * NOTE: Currently using MOCK DATA for testing purposes
 * TODO: Replace with real Firestore queries when backend is ready
 * 
 * @author Chauncey (using mock data for cross-platform testing)
 */
export class SearchService {

  /**
   * MOCK DATA - For testing purposes only
   * Simulates portfolios (containers) with nested projects
   * 
   * NOTE: This will be replaced with actual Firestore queries
   * when the portfolio storage system is implemented
   */
  private static MOCK_PORTFOLIOS: Portfolio[] = [
    {
      portfolioId: "port-001",
      userId: "user-001",
      projects: [
        {
          id: "proj-001",
          title: "Weather Forecasting App",
          desc: "A real-time weather forecasting system using React and OpenWeather API.",
          tags: ["React", "API", "TypeScript", "Weather"],
          fields: [],
          userId: "user-001",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-02-01T12:00:00Z"
        },
        {
          id: "proj-002",
          title: "Climate Data Visualizer",
          desc: "Visualizes temperature and precipitation trends using D3.js.",
          tags: ["D3.js", "Visualization", "Climate"],
          fields: [],
          userId: "user-001",
          createdAt: "2024-01-20T09:00:00Z",
          updatedAt: "2024-02-05T10:00:00Z"
        }
      ]
    },

    {
      portfolioId: "port-002",
      userId: "user-002",
      projects: [
        {
          id: "proj-003",
          title: "E-Commerce Platform",
          desc: "Full-stack e-commerce website with Stripe payments and inventory management.",
          tags: ["Node.js", "React", "MongoDB", "Stripe"],
          fields: [],
          userId: "user-002",
          createdAt: "2024-02-20T14:45:00Z",
          updatedAt: "2024-03-01T09:30:00Z"
        }
      ]
    },

    {
      portfolioId: "port-003",
      userId: "user-003",
      projects: [
        {
          id: "proj-004",
          title: "Task Management Dashboard",
          desc: "Collaborative task management tool with drag-and-drop and Firebase sync.",
          tags: ["React", "Firebase", "Material-UI"],
          fields: [],
          userId: "user-003",
          createdAt: "2024-03-10T09:15:00Z",
          updatedAt: "2024-03-12T11:00:00Z"
        }
      ]
    },

    {
      portfolioId: "port-004",
      userId: "user-004",
      projects: [
        {
          id: "proj-005",
          title: "Weather Data Visualization",
          desc: "Interactive dashboard showing climate trends across regions.",
          tags: ["Python", "Data Visualization", "D3.js"],
          fields: [],
          userId: "user-004",
          createdAt: "2024-01-25T16:20:00Z",
          updatedAt: "2024-02-02T08:15:00Z"
        }
      ]
    },

    {
      portfolioId: "port-005",
      userId: "user-005",
      projects: [
        {
          id: "proj-006",
          title: "Social Media Analytics Tool",
          desc: "Tracks engagement, follower growth, and content performance.",
          tags: ["React", "Chart.js", "REST API"],
          fields: [],
          userId: "user-005",
          createdAt: "2024-02-05T11:00:00Z",
          updatedAt: "2024-02-20T13:00:00Z"
        }
      ]
    },

    {
      portfolioId: "port-006",
      userId: "user-006",
      projects: [
        {
          id: "proj-007",
          title: "Recipe Sharing Platform",
          desc: "Community-driven recipe sharing app with ratings and profiles.",
          tags: ["React", "Firebase", "CSS"],
          fields: [],
          userId: "user-006",
          createdAt: "2024-03-15T13:30:00Z",
          updatedAt: "2024-03-20T14:45:00Z"
        }
      ]
    },

    {
      portfolioId: "port-007",
      userId: "user-007",
      projects: [
        {
          id: "proj-008",
          title: "Fitness Tracking Mobile App",
          desc: "Tracks workouts, calories, and progress with personalized plans.",
          tags: ["React Native", "Mobile", "Health"],
          fields: [],
          userId: "user-007",
          createdAt: "2024-01-30T08:45:00Z",
          updatedAt: "2024-02-10T07:00:00Z"
        }
      ]
    },

    {
      portfolioId: "port-008",
      userId: "user-008",
      projects: [
        {
          id: "proj-009",
          title: "Climate Change Awareness Website",
          desc: "Educational site with carbon calculator and environmental news.",
          tags: ["HTML", "CSS", "JavaScript", "Environment"],
          fields: [],
          userId: "user-008",
          createdAt: "2024-02-12T15:10:00Z",
          updatedAt: "2024-02-18T16:20:00Z"
        }
      ]
    }
  ];

  /**
   * Search projects across all portfolios by query string
   * Searches through project titles and descriptions within portfolio containers
   * 
   * @param query - The search query string
   * @returns Promise<SearchResult[]> - Array of matching projects with relevance scores
   */
  async searchPortfolios(query: string): Promise<SearchResult[]> {
    // Simple compatibility wrapper: call advanced search with just a query
    return this.searchPortfoliosWithFilters({ query });
  }

  /**
   * Advanced search across projects nested in portfolios using provided filters
   */
  async searchPortfoliosWithFilters(filters: SearchFilters): Promise<SearchResult[]> {
    await this.delay(300);

    const normalizedQuery = (filters.query || "").toLowerCase().trim();
    const results: SearchResult[] = [];

    for (const portfolio of SearchService.MOCK_PORTFOLIOS) {
      for (const project of portfolio.projects ?? []) {
        // Apply filters (tags, userId, date range)
        if (!this.projectMatchesFilters(project, filters)) continue;

        // If a text query exists, calculate score and skip zero-score matches
        let score = 1; // default score when no query provided
        if (normalizedQuery) {
          score = this.calculateProjectMatchScore(project, normalizedQuery);
          if (score === 0) continue;
        }

        results.push({ project, portfolioId: portfolio.portfolioId, matchScore: score });
      }
    }

    // Sort results
    this.sortResults(results, filters);

    return results;
  }

  /**
   * Calculate relevance score for a project based on search query
   * Implements weighted scoring strategy:
   * - Title matches: 3 points
   * - Description matches: 1 point
   * - Exact phrase in title: +10 bonus
   * - Exact phrase in description: +5 bonus
   * 
   * @param project - The project to evaluate
   * @param query - The normalized search query
   * @returns number - Match score (higher = more relevant)
   */
  private calculateProjectMatchScore(project: Project, query: string): number {
    let score = 0;
    const queryWords = query.split(/\s+/).filter(Boolean);

    const title = (project.title || "").toLowerCase();
    const desc = (project.desc || "").toLowerCase();
    const tags = (project.tags || []).map(t => t.toLowerCase()).join(" ");

    for (const word of queryWords) {
      if (title.includes(word)) score += 3;
      if (desc.includes(word)) score += 1;
      if (tags.includes(word)) score += 2; // tag weight
    }

    // phrase bonuses
    if (title.includes(query)) score += 10;
    if (desc.includes(query)) score += 5;

    return score;
  }

  /**
   * Return true if a project matches the provided filters (tags, user, date range)
   */
  private projectMatchesFilters(project: Project, filters: SearchFilters): boolean {
    // tagsInclude: project must include at least one
    if (filters.tagsInclude && filters.tagsInclude.length > 0) {
      const projTags = (project.tags || []).map(t => t.toLowerCase());
      const req = filters.tagsInclude.map(t => t.toLowerCase());
      const has = req.some(t => projTags.includes(t));
      if (!has) return false;
    }

    // tagsExclude: project must include none
    if (filters.tagsExclude && filters.tagsExclude.length > 0) {
      const projTags = (project.tags || []).map(t => t.toLowerCase());
      const forbid = filters.tagsExclude.map(t => t.toLowerCase());
      if (forbid.some(t => projTags.includes(t))) return false;
    }

    // userId
    if (filters.userId && filters.userId.trim()) {
      if (project.userId !== filters.userId) return false;
    }

    // date range (project.createdAt may be string or Date)
    if (filters.dateFrom || filters.dateTo) {
      const projTime = new Date(project.createdAt).getTime();
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();
        if (projTime < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo).getTime();
        const toEnd = to + 24 * 60 * 60 * 1000;
        if (projTime >= toEnd) return false;
      }
    }

    return true;
  }

  /**
   * Sort results according to filters (defaults to relevance desc)
   */
  private sortResults(results: SearchResult[], filters: SearchFilters): void {
    const sortBy = filters.sortBy || "relevance";
    const sortOrder = filters.sortOrder || (sortBy === "relevance" ? "desc" : "asc");

    results.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "relevance":
          cmp = a.matchScore - b.matchScore;
          break;
        case "date":
          cmp = new Date(a.project.createdAt).getTime() - new Date(b.project.createdAt).getTime();
          break;
        case "alphabetical":
          cmp = a.project.title.localeCompare(b.project.title);
          break;
      }
      return sortOrder === "desc" ? -cmp : cmp;
    });
  }

  /**
   * Simulate network delay for realistic API behavior
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all portfolios (for testing purposes)
   */
  async getAllPortfolios(): Promise<Portfolio[]> {
    await this.delay(200);
    return [...SearchService.MOCK_PORTFOLIOS];
  }

  /**
   * TODO: Future implementation with Firestore
   * 
   * When portfolio storage is ready, replace with:
   * 
   * async searchPortfolios(query: string): Promise<SearchResult[]> {
   *   const portfoliosRef = collection(db, "portfolios");
   *   const portfoliosSnapshot = await getDocs(portfoliosRef);
   *   
   *   const results: SearchResult[] = [];
   *   
   *   for (const portfolioDoc of portfoliosSnapshot.docs) {
   *     const portfolio = portfolioDoc.data() as Portfolio;
   *     for (const project of portfolio.projects) {
   *       const score = this.calculateProjectMatchScore(project, query);
   *       if (score > 0) {
   *         results.push({ project, portfolioId: portfolio.portfolioId, matchScore: score });
   *       }
   *     }
   *   }
   *   
   *   return results.sort((a, b) => b.matchScore - a.matchScore);
   * }
   */
}