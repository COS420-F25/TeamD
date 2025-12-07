import { GitHubRepoService, Repository } from '../services/GitHubRepoService';

// Set environment variables before importing the service
process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project-id';
process.env.REACT_APP_FUNCTIONS_REGION = 'us-central1';
process.env.REACT_APP_FUNCTIONS_PORT = '5001';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHubRepoService', () => {
  let service: GitHubRepoService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GitHubRepoService();
  });

  describe('constructor', () => {
    test('constructs correct functions URL from environment variables', () => {
      // Access the private functionsUrl property using type assertion
      const functionsUrl = (service as any).functionsUrl;

      // Verify complete URL structure with mocked env vars
      const expectedUrl = 'http://127.0.0.1:5001/test-project-id/us-central1';
      expect(functionsUrl).toBe(expectedUrl);

      // Verify URL contains expected components
      expect(functionsUrl).toContain('http://127.0.0.1:5001');
      expect(functionsUrl).toContain('test-project-id');
      expect(functionsUrl).toContain('us-central1');
    });
  });

  describe('getRepositories', () => {
    test('successfully fetches repositories with valid response', async () => {
      // Mock data
      const mockRepositories: Repository[] = [
        {
          id: 1,
          name: 'test-repo',
          fullName: 'user/test-repo',
          description: 'A test repository',
          url: 'https://github.com/user/test-repo',
          private: false,
          stars: 10,
          language: 'TypeScript',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock fetch response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ repositories: mockRepositories })
      });

      // Call method
      const result = await service.getRepositories('installation-123');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('getRepositories?installation_id=installation-123')
      );
      expect(result).toEqual(mockRepositories);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('test-repo');
      expect(result[0].language).toBe('TypeScript');
    });

    test('throws error when response is not OK', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn() // Should not be called
      });

      // Assert error is thrown
      await expect(service.getRepositories('installation-123'))
        .rejects
        .toThrow('Error fetching repositories');

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
    });

    test('handles network errors gracefully', async () => {
      // Mock network error
      const networkError = new Error('Network request failed');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      // Assert error is propagated
      await expect(service.getRepositories('installation-123'))
        .rejects
        .toThrow('Network request failed');
    });

    test('verifies fetch called with correct URL parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ repositories: [] })
      });

      await service.getRepositories('test-install-456');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/getRepositories\?installation_id=test-install-456$/)
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('handles malformed JSON response', async () => {
      // This tests the scenario where server returns HTML error page instead of JSON
      // Example: Server crashes and returns "<html>500 Error</html>"
      // When response.json() tries to parse it, throws SyntaxError
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON at position 0');
        }
      });

      await expect(service.getRepositories('installation-123'))
        .rejects
        .toThrow('Unexpected token');
    });

    test('returns empty array when no repositories exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ repositories: [] })
      });

      const result = await service.getRepositories('installation-123');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
