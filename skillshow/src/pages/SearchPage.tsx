// src/pages/SearchPage.tsx

import React, { useState } from "react";
import { SearchService } from "../services/SearchService";
import { SearchResult } from "../types/Portfolio";
import { PortfolioCard } from "../components/PortfolioCard";

interface SearchPageProps {
  user: any;
  onNavigateToProfile?: (userId: string) => void;
}

/**
 * SearchPage - Main search interface for finding portfolios
 * 
 * Features:
 * - Text-based search through portfolio titles and descriptions
 * - Real-time search results
 * - Click to view user profiles
 * 
 * NOTE: Currently uses mock data for testing
 * @author Chauncey (using mock data for cross-platform testing)
 */
export function SearchPage({ user, onNavigateToProfile }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchService = new SearchService();

  /**
   * Handle search submission
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await searchService.searchPortfolios(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in search input
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Handle portfolio card click - navigate to user profile
   */
  const handleCardClick = (userId: string) => {
    console.log("Navigating to profile for user:", userId);
    
    // TODO: Implement actual navigation to profile page
    // For now, just alert the user
    alert(`Navigation to profile for user ${userId} will be implemented`);
    
    // If navigation callback is provided, use it
    if (onNavigateToProfile) {
      onNavigateToProfile(userId);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "24px", color: "#333" }}>
        Search Portfolios
      </h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Search for portfolios (e.g., 'weather app', 'e-commerce')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              outline: "none"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#7b6be5";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              padding: "12px 32px",
              fontSize: "16px",
              backgroundColor: "#7b6be5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Advanced Search Button - Placeholder for future feature */}
        <div style={{ marginTop: "12px" }}>
          <button
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#7b6be5",
              border: "2px solid #7b6be5",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onClick={() => alert("Advanced search coming soon!")}
          >
            Advanced Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div>
        {isLoading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div>Loading results...</div>
          </div>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>
              No portfolios found
            </div>
            <div style={{ fontSize: "14px" }}>
              Try different keywords or check your spelling
            </div>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div>
            <div style={{ marginBottom: "16px", color: "#666", fontSize: "14px" }}>
              Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </div>
            {searchResults.map((result) => (
              <PortfolioCard
                key={result.portfolio.portfolioId}
                portfolio={result.portfolio}
                onClick={() => handleCardClick(result.portfolio.userId)}
              />
            ))}
          </div>
        )}

        {!hasSearched && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>
              Search for portfolios and projects
            </div>
            <div style={{ fontSize: "14px" }}>
              Enter keywords like "weather app", "e-commerce", or "dashboard"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}