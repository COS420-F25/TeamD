// src/services/SearchService.ts

import { Portfolio, SearchResult } from "../types/Portfolio";
import { Project } from "../types/Project";

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
      projects: [
        {
          id: "proj-001",
          title: "Weather Forecasting App",
          desc: "A real-time weather forecasting system using React and OpenWeather API.",
          tags: ["React", "API", "TypeScript", "Weather"],
          fields: [],
          userId: "user-001",
          createdAt: "2024-01-15T10:30:00Z"
        },
        {
          id: "proj-002",
          title: "Climate Data Visualizer",
          desc: "Visualizes temperature and precipitation trends using D3.js.",
          tags: ["D3.js", "Visualization", "Climate"],
          fields: [],
          userId: "user-001",
          createdAt: "2024-01-20T09:00:00Z"
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
          createdAt: "2024-02-20T14:45:00Z"
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
          createdAt: "2024-03-10T09:15:00Z"
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
          createdAt: "2024-01-25T16:20:00Z"
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
          createdAt: "2024-02-05T11:00:00Z"
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
          createdAt: "2024-03-15T13:30:00Z"
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
          createdAt: "2024-01-30T08:45:00Z"
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
          createdAt: "2024-02-12T15:10:00Z"
        }
      ]
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
    // Simulate network delay (like a real API call)
    await this.delay(300);

    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search through mock portfolios
    for (const portfolio of SearchService.MOCK_PORTFOLIOS) {
      for (const project of portfolio.projects ?? []){
        const matchScore = this.calculateProjectMatchScore(project, normalizedQuery);
        if (matchScore > 0) {
          results.push({
            project,
            portfolioId: portfolio.portfolioId,
            matchScore
          });
        }
      } 
    }

    // Sort by relevance (highest match score first)
    results.sort((a, b) => b.matchScore - a.matchScore);

    return results;
  }

  /**
   * Calculate relevance score for a portfolio based on search query
   * Searches in: title and description
   * 
   * @param portfolio - The portfolio to evaluate
   * @param query - The normalized search query
   * @returns number - Match score (higher = more relevant)
   */
  // private calculateMatchScore(portfolio: Portfolio, query: string): number {
  //   let score = 0;
  //   const queryWords = query.split(/\s+/);

  //   const title = portfolio.title.toLowerCase();
  //   const description = portfolio.description.toLowerCase();

  //   for (const word of queryWords) {
  //     // Title matches are worth more (weight: 3)
  //     if (title.includes(word)) {
  //       score += 3;
  //     }

  //     // Description matches (weight: 1)
  //     if (description.includes(word)) {
  //       score += 1;
  //     }
  //   }

  //   // Bonus for exact phrase match in title
  //   if (title.includes(query)) {
  //     score += 10;
  //   }

  //   // Bonus for exact phrase match in description
  //   if (description.includes(query)) {
  //     score += 5;
  //   }

  //   return score;
  // }

  private calculateProjectMatchScore(project: Project, query: string): number {
    let score = 0;
    const queryWords = query.split(/\s+/);

    const title = project.title.toLowerCase();
    const desc = project.desc.toLowerCase();

    for (const word of queryWords) {
      if (title.includes(word)) score += 3;
      if (desc.includes(word)) score += 1;
    }

    if (title.includes(query)) score += 10;
    if (desc.includes(query)) score += 5;

    return score;
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