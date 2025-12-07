// src/pages/SearchPage.tsx

import React, { useState } from "react";
import { SearchService } from "../services/SearchService";
import { SearchResult, SearchFilters } from "../types/Portfolio";
import { PortfolioCard } from "../components/PortfolioCard";
import { AdvancedSearchPanel } from "../components/AdvancedSearchPanel";

interface SearchPageProps {
  user: any;
  onNavigateToProfile?: (userId: string) => void;
}

/**
 * SearchPage - Main search interface for finding portfolios
 * 
 * Features:
 * - Text-based search through portfolio titles and descriptions
 * - Advanced filters: tags, user name, date range, sorting
 * - Real-time search results
 * - Click to view user profiles
 * 
 * NOTE: Currently uses mock data for testing
 * @author Chauncey (using mock data for cross-platform testing)
 * @author Senior Engineer (advanced search implementation)
 */
export function SearchPage({ user, onNavigateToProfile }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAdvancedPanelOpen, setIsAdvancedPanelOpen] = useState(false);

  const searchService = new SearchService();

  /**
   * Handle search submission
   */
  const handleSearch = async () => {
    // Check if we have a query or active filters
    const hasQuery = searchQuery.trim().length > 0;
    const hasFilters = Boolean(
      searchFilters.tagsInclude?.length ||
      searchFilters.tagsExclude?.length ||
      searchFilters.userName ||
      searchFilters.dateFrom ||
      searchFilters.dateTo
    );

    if (!hasQuery && !hasFilters) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Combine query with filters
      const filters: SearchFilters = {
        ...searchFilters,
        query: searchQuery.trim() || undefined
      };
      
      const results = await searchService.searchPortfoliosWithFilters(filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle filters change from AdvancedSearchPanel
   */
  const handleFiltersChange = async (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
    // Auto-search when filters change (if we have a query or other filters)
    const hasQuery = searchQuery.trim().length > 0;
    const hasOtherFilters = Boolean(
      newFilters.tagsInclude?.length ||
      newFilters.tagsExclude?.length ||
      newFilters.userName ||
      newFilters.dateFrom ||
      newFilters.dateTo
    );
    
    if (hasQuery || hasOtherFilters) {
      setIsLoading(true);
      setHasSearched(true);
      
      try {
        // Use newFilters directly to avoid stale state
        const filters: SearchFilters = {
          ...newFilters,
          query: searchQuery.trim() || undefined
        };
        
        const results = await searchService.searchPortfoliosWithFilters(filters);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        alert("An error occurred while searching. Please try again.");
      } finally {
        setIsLoading(false);
      }
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
              e.currentTarget.style.borderColor = "#fa7d35ff";
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

        {/* Advanced Search Panel */}
        <div style={{ marginTop: "12px" }}>
          <AdvancedSearchPanel
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
            isOpen={isAdvancedPanelOpen}
            onToggle={() => setIsAdvancedPanelOpen(!isAdvancedPanelOpen)}
          />
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