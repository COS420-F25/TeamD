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
    expect(screen.getByText("Search Projects")).toBeInTheDocument();
  });

  test("displays search input and button", () => {
    render(<SearchPage user={null} />);
    expect(screen.getByPlaceholderText(/search for projects/i)).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  test("updates search input value when typing", () => {
    render(<SearchPage user={null} />);
    const input = screen.getByPlaceholderText(/search for projects/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "weather app" } });
    
    expect(input.value).toBe("weather app");
  });

  test("performs search when button is clicked", async () => {
    const mockResults = [{
      project: {
        id: "p-1",
        title: "Weather App",
        desc: "A test app",
        tags: [],
        userId: "user-1",
        createdAt: "2024-01-01"
      },
      portfolioId: "1",
      matchScore: 10
    }];

    (SearchService as unknown as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue(mockResults),
      searchPortfoliosWithFilters: jest.fn().mockResolvedValue(mockResults)
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
      { target: { value: "weather" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("Weather App")).toBeInTheDocument();
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
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
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
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
      { target: { value: "nothing" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("No projects found")).toBeInTheDocument();
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