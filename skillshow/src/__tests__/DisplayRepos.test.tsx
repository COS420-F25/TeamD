import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisplayRepos } from '../components/DisplayRepos';
import { getDoc } from 'firebase/firestore';
import { GitHubRepoService } from '../services/GitHubRepoService';

jest.mock('../firebase-config', () => ({
  auth: {
    currentUser: { uid: 'pinecube888' },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: 'pinecube888' });
      return jest.fn();
    }),
  },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../services/GitHubRepoService');

describe('DisplayRepos Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading message initially', () => {
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({ githubInstallationId: '888' }),
    });

    render(<DisplayRepos />);
    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });

  test('shows GitHub not connected when no installation_id exists', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({}),
    });

    render(<DisplayRepos />);

    await waitFor(() => {
      expect(screen.getByText('GitHub not connected')).toBeInTheDocument();
    });
  });

  test('displays repositories when they are connected', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'cool stuff',
        fullName: 'pinecube/coolstuff',
        description: "There's a lot of cool stuff here",
        url: 'https://github.com/pinecube/coolstuff',
        private: false,
        stars: 67,
        language: 'cobol',
        updatedAt: '1989-03-01',
      },
    ];

    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({ githubInstallationId: '888' }),
    });

    (GitHubRepoService as jest.Mock).mockImplementation(() => ({
      getRepositories: jest.fn().mockResolvedValue(mockRepos),
    }));

    render(<DisplayRepos />);

    await waitFor(() => {
      expect(screen.getByText(/Your GitHub Repositories/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('pinecube/coolstuff')).toBeInTheDocument();
    expect(screen.getByText("There's a lot of cool stuff here")).toBeInTheDocument();
  });
});