// src/__tests__/SearchPage.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchPage } from "../pages/SearchPage";
import { SearchService } from "../services/SearchService";

jest.mock("../services/SearchService");

// Mock firebase-config to prevent Firestore initialization issues
jest.mock("../firebase-config", () => ({
  db: {},
  auth: {
    currentUser: null,
  },
  app: {},
}));

describe("SearchPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("renders SearchPage without crashing", () => {
    render(<SearchPage user={null} />);
    expect(screen.getByText("Search Portfolios")).toBeInTheDocument();
  });

  test("displays search input and button", () => {
    render(<SearchPage user={null} />);
    expect(screen.getByPlaceholderText(/search for portfolios/i)).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  test("updates search input value when typing", () => {
    render(<SearchPage user={null} />);
    const input = screen.getByPlaceholderText(/search for portfolios/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "weather app" } });
    
    expect(input.value).toBe("weather app");
  });

  test("performs search when button is clicked", async () => {
    const mockResults = [{
      portfolio: {
        portfolioId: "1",
        userId: "user-1",
        userName: "Test User",
        userEmail: "test@test.com",
        title: "Weather App",
        description: "A test app",
        tags: [],
        createdAt: "2024-01-01"
      },
      matchScore: 10
    }];

    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue(mockResults),
      searchPortfoliosWithFilters: jest.fn().mockResolvedValue(mockResults)
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for portfolios/i), 
      { target: { value: "weather" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  test("shows loading state during search", async () => {
    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      ),
      searchPortfoliosWithFilters: jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      )
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for portfolios/i), 
      { target: { value: "test" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("Searching...")).toBeInTheDocument();
    });
  });

  test("shows no results message when search returns empty", async () => {
    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue([]),
      searchPortfoliosWithFilters: jest.fn().mockResolvedValue([])
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for portfolios/i), 
      { target: { value: "nothing" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("No portfolios found")).toBeInTheDocument();
    });
  });

  // Advanced Search Feature Tests
  test("toggles advanced search panel when button is clicked", async () => {
    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue([]),
      searchPortfoliosWithFilters: jest.fn().mockResolvedValue([]),
      getAvailableTags: jest.fn().mockResolvedValue(["React", "TypeScript"])
    }));

    render(<SearchPage user={null} />);
    
    const advancedButton = screen.getByText("Advanced Search");
    expect(advancedButton).toBeInTheDocument();
    
    // Panel should not be visible initially
    expect(screen.queryByText("Include Tags")).not.toBeInTheDocument();
    
    // Click to open - this triggers async tag loading
    fireEvent.click(advancedButton);
    
    // Wait for tags to load and panel to render
    await waitFor(() => {
      expect(screen.getByText("Include Tags")).toBeInTheDocument();
    });
    
    // Click to close
    fireEvent.click(advancedButton);
    
    await waitFor(() => {
      expect(screen.queryByText("Include Tags")).not.toBeInTheDocument();
    });
  });

  test("filters portfolios by included tags", async () => {
    const mockResults = [{
      portfolio: {
        portfolioId: "1",
        userId: "user-1",
        userName: "Test User",
        userEmail: "test@test.com",
        title: "React App",
        description: "A React app",
        tags: ["React", "TypeScript"],
        createdAt: "2024-01-01"
      },
      matchScore: 10
    }];

    const mockSearchWithFilters = jest.fn().mockResolvedValue(mockResults);

    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue([]),
      searchPortfoliosWithFilters: mockSearchWithFilters,
      getAvailableTags: jest.fn().mockResolvedValue(["React", "TypeScript", "Node.js"])
    }));

    render(<SearchPage user={null} />);
    
    // Open advanced search - this triggers async tag loading
    fireEvent.click(screen.getByText("Advanced Search"));
    
    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });
    
    // Click on React tag to include it - use getByLabelText for proper Testing Library access
    const reactCheckbox = screen.getByLabelText(/React/i);
    fireEvent.click(reactCheckbox);
    
    // Verify search was called with include filter
    await waitFor(() => {
      expect(mockSearchWithFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          tagsInclude: ["React"]
        })
      );
    }, { timeout: 3000 });
  });

  test("advanced search panel has sort options", async () => {
    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue([]),
      searchPortfoliosWithFilters: jest.fn().mockResolvedValue([]),
      getAvailableTags: jest.fn().mockResolvedValue([])
    }));

    render(<SearchPage user={null} />);
    
    // Open advanced search
    fireEvent.click(screen.getByText("Advanced Search"));
    
    // Wait for panel to render
    await waitFor(() => {
      expect(screen.getByText("Sort By")).toBeInTheDocument();
    });
    
    // Verify sort dropdown exists
    expect(screen.getByDisplayValue("Relevance")).toBeInTheDocument();
  });
});