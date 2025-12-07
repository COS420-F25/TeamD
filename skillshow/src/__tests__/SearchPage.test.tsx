// src/__tests__/SearchPage.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchPage } from "../pages/SearchPage";
import { SearchService } from "../services/SearchService";

jest.mock("../services/SearchService");

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

    (SearchService as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue(mockResults)
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
      { target: { value: "weather" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  test("shows loading state during search", async () => {
    (SearchService as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      )
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
      { target: { value: "test" } });
    fireEvent.click(screen.getByText("Search"));
    
    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  test("shows no results message when search returns empty", async () => {
    (SearchService as jest.Mock).mockImplementation(() => ({
      searchPortfolios: jest.fn().mockResolvedValue([])
    }));

    render(<SearchPage user={null} />);
    
    fireEvent.change(screen.getByPlaceholderText(/search for projects/i), 
      { target: { value: "nothing" } });
    fireEvent.click(screen.getByText("Search"));
    
    await waitFor(() => {
      expect(screen.getByText("No projects found")).toBeInTheDocument();
    });
  });
});