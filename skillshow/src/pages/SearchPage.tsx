// src/pages/SearchPage.tsx

import React, { useState } from "react";
// TODO: Import SearchService from services
// TODO: Import SearchResult type from types
// TODO: Import PortfolioCard component

// TODO: Define SearchPageProps interface

/**
 * TODO: Add component documentation
 * SearchPage - Main interface for searching portfolios
 */
export function SearchPage({ user }: /* TODO: Add props type */) {
  // TODO: Create state for searchQuery (string)
  // TODO: Create state for searchResults (SearchResult[])
  // TODO: Create state for isLoading (boolean)
  // TODO: Create state for hasSearched (boolean)

  // TODO: Create instance of SearchService

  /**
   * TODO: Implement handleSearch function
   * Should:
   * 1. Check if query is not empty
   * 2. Set loading to true
   * 3. Call searchService.searchPortfolios()
   * 4. Update searchResults state
   * 5. Set loading to false
   */
  const handleSearch = async () => {
    // TODO: Implement search logic
  };

  /**
   * TODO: Implement handleKeyPress function
   * Should call handleSearch when Enter key is pressed
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // TODO: Check if key is "Enter", then call handleSearch
  };

  /**
   * TODO: Implement handleCardClick function
   * Should log userId and show alert (navigation comes later)
   */
  const handleCardClick = (userId: string) => {
    // TODO: Log the userId
    // TODO: Show alert for now
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* TODO: Add page title */}
      <h1>Search Portfolios</h1>

      {/* TODO: Create search bar section */}
      <div>
        {/* TODO: Add search input */}
        <input
          type="text"
          placeholder="Search for portfolios..."
          // TODO: Connect to searchQuery state
          // TODO: Add onChange handler
          // TODO: Add onKeyPress handler
        />
        
        {/* TODO: Add search button */}
        <button
          onClick={/* TODO: Call handleSearch */}
          disabled={/* TODO: Disable when loading */}
        >
          {/* TODO: Show "Searching..." when loading, else "Search" */}
        </button>
      </div>

      {/* TODO: Display search results section */}
      <div>
        {/* TODO: Show loading message when isLoading is true */}
        
        {/* TODO: Show "no results" when hasSearched && results.length === 0 */}
        
        {/* TODO: Show results when results.length > 0 */}
        {/* Use .map() to render PortfolioCard for each result */}
        
        {/* TODO: Show initial prompt when !hasSearched */}
      </div>
    </div>
  );
}














// import React from "react";

// export function SearchPage({ user }: {user: any}) {

//     return (
//         <div style={{ padding: 20}}>
//             <h1> Search Page </h1>
//             <p>This is a placeholder for Search page</p>
//         </div>
//     )
// }
