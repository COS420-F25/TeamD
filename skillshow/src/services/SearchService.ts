// src/services/SearchService.ts

import { Portfolio, SearchResult, SearchFilters } from "../types/Portfolio";

/**
 * SearchService handles portfolio search functionality
 * 
 * NOTE: Currently using MOCK DATA for testing purposes
 * TODO: Replace with real Firestore queries when backend is ready
 * 
 * @author Chauncey (using mock data for cross-platform testing)
 */
export class SearchService {
  
  /**
   * MOCK DATA - For testing purposes only
   * This simulates portfolios stored in Firestore
   * 
   * NOTE: This will be replaced with actual Firestore queries
   * when the portfolio storage system is implemented
   */
  private static MOCK_PORTFOLIOS: Portfolio[] = [
    {
      portfolioId: "port-001",
      userId: "user-001",
      userName: "Alice Johnson",
      userEmail: "alice@example.com",
      title: "Weather Forecasting App",
      description: "Built a real-time weather forecasting system using React and OpenWeather API. Features include 7-day forecasts, location search, and weather alerts.",
      tags: ["React", "API", "TypeScript", "Weather"],
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      portfolioId: "port-002",
      userId: "user-002",
      userName: "Bob Martinez",
      userEmail: "bob@example.com",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce website with shopping cart, payment integration using Stripe, and inventory management system.",
      tags: ["Node.js", "React", "MongoDB", "Stripe"],
      createdAt: "2024-02-20T14:45:00Z"
    },
    {
      portfolioId: "port-003",
      userId: "user-003",
      userName: "Carol Zhang",
      userEmail: "carol@example.com",
      title: "Task Management Dashboard",
      description: "Collaborative task management tool with drag-and-drop functionality, team assignments, and real-time updates using Firebase.",
      tags: ["React", "Firebase", "Material-UI"],
      createdAt: "2024-03-10T09:15:00Z"
    },
    {
      portfolioId: "port-004",
      userId: "user-004",
      userName: "David Kim",
      userEmail: "david@example.com",
      title: "Weather Data Visualization",
      description: "Interactive weather data visualization dashboard displaying climate trends, temperature patterns, and precipitation data across different regions.",
      tags: ["Python", "Data Visualization", "D3.js"],
      createdAt: "2024-01-25T16:20:00Z"
    },
    {
      portfolioId: "port-005",
      userId: "user-005",
      userName: "Emma Wilson",
      userEmail: "emma@example.com",
      title: "Social Media Analytics Tool",
      description: "Analytics platform for tracking social media engagement, follower growth, and content performance across multiple platforms.",
      tags: ["React", "Chart.js", "REST API"],
      createdAt: "2024-02-05T11:00:00Z"
    },
    {
      portfolioId: "port-006",
      userId: "user-006",
      userName: "Frank Anderson",
      userEmail: "frank@example.com",
      title: "Recipe Sharing Platform",
      description: "Community-driven recipe sharing application where users can post recipes, rate dishes, and follow their favorite chefs.",
      tags: ["React", "Firebase", "CSS"],
      createdAt: "2024-03-15T13:30:00Z"
    },
    {
      portfolioId: "port-007",
      userId: "user-007",
      userName: "Grace Lee",
      userEmail: "grace@example.com",
      title: "Fitness Tracking Mobile App",
      description: "Mobile fitness application for tracking workouts, calories, and progress over time with personalized workout recommendations.",
      tags: ["React Native", "Mobile", "Health"],
      createdAt: "2024-01-30T08:45:00Z"
    },
    {
      portfolioId: "port-008",
      userId: "user-008",
      userName: "Henry Brown",
      userEmail: "henry@example.com",
      title: "Climate Change Awareness Website",
      description: "Educational website about climate change featuring weather pattern analysis, carbon footprint calculator, and environmental news.",
      tags: ["HTML", "CSS", "JavaScript", "Environment"],
      createdAt: "2024-02-12T15:10:00Z"
    }
  ];

  /**
   * Search portfolios by query string
   * Searches through portfolio titles and descriptions
   * 
   * @param query - The search query string
   * @returns Promise<SearchResult[]> - Array of matching portfolios with relevance scores
   */
  async searchPortfolios(query: string): Promise<SearchResult[]> {
    // Use advanced search with just the query for backward compatibility
    return this.searchPortfoliosWithFilters({ query });
  }

  /**
   * Advanced search with filters
   * Supports text search, tag filtering, date range, user name, and sorting
   * 
   * @param filters - Search filters object
   * @returns Promise<SearchResult[]> - Array of matching portfolios with relevance scores
   */
  async searchPortfoliosWithFilters(filters: SearchFilters): Promise<SearchResult[]> {
    // Simulate network delay (like a real API call)
    await this.delay(300);

    const results: SearchResult[] = [];
    const normalizedQuery = filters.query?.toLowerCase().trim() || "";

    // Search through mock portfolios
    for (const portfolio of SearchService.MOCK_PORTFOLIOS) {
      // Apply filters
      if (!this.matchesFilters(portfolio, filters)) {
        continue;
      }

      // Calculate match score if query is provided
      let matchScore = 0;
      if (normalizedQuery) {
        matchScore = this.calculateMatchScore(portfolio, normalizedQuery);
        if (matchScore === 0) {
          continue; // No text match, skip this portfolio
        }
      } else {
        // If no query, assign a default score for sorting purposes
        matchScore = 1;
      }

      results.push({
        portfolio,
        matchScore
      });
    }

    // Sort results
    this.sortResults(results, filters);

    return results;
  }

  /**
   * Check if a portfolio matches the given filters
   * 
   * @param portfolio - The portfolio to check
   * @param filters - The filters to apply
   * @returns boolean - True if portfolio matches all filters
   */
  private matchesFilters(portfolio: Portfolio, filters: SearchFilters): boolean {
    // Tag include filter: portfolio must have at least one of the specified tags
    if (filters.tagsInclude && filters.tagsInclude.length > 0) {
      const portfolioTags = portfolio.tags.map(t => t.toLowerCase());
      const filterTags = filters.tagsInclude.map(t => t.toLowerCase());
      const hasMatchingTag = filterTags.some(tag => portfolioTags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Tag exclude filter: portfolio must not have any of the specified tags
    if (filters.tagsExclude && filters.tagsExclude.length > 0) {
      const portfolioTags = portfolio.tags.map(t => t.toLowerCase());
      const filterTags = filters.tagsExclude.map(t => t.toLowerCase());
      const hasExcludedTag = filterTags.some(tag => portfolioTags.includes(tag));
      if (hasExcludedTag) {
        return false;
      }
    }

    // User name filter: case-insensitive partial match
    if (filters.userName && filters.userName.trim()) {
      const userName = portfolio.userName.toLowerCase();
      const filterName = filters.userName.toLowerCase().trim();
      if (!userName.includes(filterName)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const portfolioDate = new Date(portfolio.createdAt).getTime();
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        if (portfolioDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime();
        // Add one day to include the entire end date
        const toDateEnd = toDate + 24 * 60 * 60 * 1000;
        if (portfolioDate >= toDateEnd) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Sort search results based on filter options
   * 
   * @param results - The results to sort (modified in place)
   * @param filters - The filters containing sort options
   */
  private sortResults(results: SearchResult[], filters: SearchFilters): void {
    const sortBy = filters.sortBy || "relevance";
    // Default sort order: desc for relevance and updated, asc for others
    const defaultSortOrder = (sortBy === "relevance" || sortBy === "updated") ? "desc" : "asc";
    const sortOrder = filters.sortOrder || defaultSortOrder;

    results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "relevance":
          comparison = a.matchScore - b.matchScore;
          break;
        case "date":
          const dateA = new Date(a.portfolio.createdAt).getTime();
          const dateB = new Date(b.portfolio.createdAt).getTime();
          comparison = dateA - dateB;
          break;
        case "updated":
          // Use updatedAt if available, otherwise fall back to createdAt
          const updatedA = a.portfolio.updatedAt 
            ? new Date(a.portfolio.updatedAt).getTime()
            : new Date(a.portfolio.createdAt).getTime();
          const updatedB = b.portfolio.updatedAt
            ? new Date(b.portfolio.updatedAt).getTime()
            : new Date(b.portfolio.createdAt).getTime();
          comparison = updatedA - updatedB;
          break;
        case "alphabetical":
          comparison = a.portfolio.title.localeCompare(b.portfolio.title);
          break;
      }

      // Apply sort order
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }

  /**
   * Calculate relevance score for a portfolio based on search query
   * Searches in: title, description, and tags
   * 
   * @param portfolio - The portfolio to evaluate
   * @param query - The normalized search query
   * @returns number - Match score (higher = more relevant)
   */
  private calculateMatchScore(portfolio: Portfolio, query: string): number {
    let score = 0;
    const queryWords = query.split(/\s+/);

    const title = portfolio.title.toLowerCase();
    const description = portfolio.description.toLowerCase();
    const tags = portfolio.tags.map(t => t.toLowerCase()).join(" ");

    for (const word of queryWords) {
      // Title matches are worth more (weight: 3)
      if (title.includes(word)) {
        score += 3;
      }

      // Description matches (weight: 1)
      if (description.includes(word)) {
        score += 1;
      }

      // Tag matches (weight: 2)
      if (tags.includes(word)) {
        score += 2;
      }
    }

    // Bonus for exact phrase match in title
    if (title.includes(query)) {
      score += 10;
    }

    // Bonus for exact phrase match in description
    if (description.includes(query)) {
      score += 5;
    }

    return score;
  }

  /**
   * Get all available tags from mock portfolios (for filter UI)
   * 
   * @returns Promise<string[]> - Array of unique tags
   */
  async getAvailableTags(): Promise<string[]> {
    await this.delay(100);
    const allTags = new Set<string>();
    
    for (const portfolio of SearchService.MOCK_PORTFOLIOS) {
      portfolio.tags.forEach(tag => allTags.add(tag));
    }
    
    return Array.from(allTags).sort();
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
   *   const q = query(
   *     portfoliosRef,
   *     where("title", ">=", query),
   *     where("title", "<=", query + '\uf8ff')
   *   );
   *   const snapshot = await getDocs(q);
   *   // ... process results
   * }
   */
}