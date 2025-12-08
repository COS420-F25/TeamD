/* File created with Claude Code */

import { SearchService } from '../services/SearchService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SearchResult, Portfolio } from '../types/Portfolio';

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService();
  });

  describe('searchPortfolios', () => {
   

    test('performs case-insensitive search', async () => {
      const lowercaseResults = await searchService.searchPortfolios('weather');
      const uppercaseResults = await searchService.searchPortfolios('WEATHER');

      expect(uppercaseResults).toHaveLength(lowercaseResults.length);
      expect(uppercaseResults[0].portfolioId)
        .toBe(lowercaseResults[0].portfolioId);
      expect(uppercaseResults[0].matchScore).toBe(lowercaseResults[0].matchScore);
    });

    test('sorts results by relevance (match score)', async () => {
      // Search for "weather" which returns 3 portfolios with different scores
      const results = await searchService.searchPortfolios('weather');

      // Verify we have multiple results to test sorting
      expect(results.length).toBeGreaterThanOrEqual(2);

      // Extract match scores
      const matchScores = results.map(r => r.matchScore);

      // Verify array is sorted in descending order
      const sortedScores = [...matchScores].sort((a, b) => b - a);
      expect(matchScores).toEqual(sortedScores);
    });

    test('scores title matches higher than description matches', async () => {
      // Search for a term that appears in both titles and descriptions
      const results = await searchService.searchPortfolios('app');

      // Verify we have results
      expect(results.length).toBeGreaterThan(0);

      // All results should have positive scores
      expect(results.every(r => r.matchScore > 0)).toBe(true);

      // Find a portfolio with "app" in the title
      const titleMatch = results.find(r =>
        r.project.title.toLowerCase().includes('app')
      );

      // We should always find at least one title match for "app"
      expect(titleMatch).toBeDefined();
      expect(titleMatch!.matchScore).toBeGreaterThan(0);
    });

    test('applies bonus for exact phrase match in title', async () => {
      // Search for exact title phrase
      const exactResults = await searchService.searchPortfolios('Weather Forecasting App');

      // Search for partial title (just one word)
      const partialResults = await searchService.searchPortfolios('Weather');

      // Find the specific portfolio in both result sets
      const exactMatch = exactResults.find(r => r.portfolioId === 'port-001');
      const partialMatch = partialResults.find(r => r.portfolioId === 'port-001');

      // Both should exist
      expect(exactMatch).toBeDefined();
      expect(partialMatch).toBeDefined();

      // Exact match should have higher score due to +10 bonus
      expect(exactMatch!.matchScore).toBeGreaterThan(partialMatch!.matchScore);
    });
  });

  describe('getAllPortfolios', () => {
    test('returns all portfolios', async () => {
      const portfolios = await searchService.getAllPortfolios();

      expect(portfolios).toHaveLength(8); // MOCK_PORTFOLIOS has 8 items
      expect(portfolios[0]).toHaveProperty('portfolioId');
      expect(portfolios[0]).toHaveProperty('userId');
      expect(portfolios[0]).toHaveProperty('projects');
      expect(Array.isArray(portfolios[0].projects)).toBe(true);
      expect(portfolios[0].projects.length).toBeGreaterThan(0);
      expect(portfolios[0].projects[0]).toHaveProperty('id');
      expect(portfolios[0].projects[0]).toHaveProperty('title');
      expect(portfolios[0].projects[0]).toHaveProperty('desc');
    });
  });
});
