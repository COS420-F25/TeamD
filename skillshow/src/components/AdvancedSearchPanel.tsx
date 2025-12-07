// src/components/AdvancedSearchPanel.tsx

import React, { useState, useEffect, useMemo } from "react";
import { SearchFilters } from "../types/Portfolio";
import { SearchService } from "../services/SearchService";

interface AdvancedSearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * AdvancedSearchPanel - Collapsible panel for advanced search filters
 * 
 * Features:
 * - Tag filtering with include/exclude options (multi-select)
 * - User name filtering
 * - Date range filtering
 * - Sort options (relevance, date, updated, alphabetical)
 * 
 * @author Senior Engineer
 */
export function AdvancedSearchPanel({
  filters,
  onFiltersChange,
  isOpen,
  onToggle
}: AdvancedSearchPanelProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const searchService = useMemo(() => new SearchService(), []);

  // Load available tags on mount
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true);
      try {
        const tags = await searchService.getAvailableTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Error loading tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    if (isOpen) {
      loadTags();
    }
  }, [isOpen, searchService]);

  /**
   * Handle tag include checkbox change
   */
  const handleTagIncludeChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tagsInclude || [];
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);
    
    onFiltersChange({
      ...filters,
      tagsInclude: newTags.length > 0 ? newTags : undefined
    });
  };

  /**
   * Handle tag exclude checkbox change
   */
  const handleTagExcludeChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tagsExclude || [];
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);
    
    onFiltersChange({
      ...filters,
      tagsExclude: newTags.length > 0 ? newTags : undefined
    });
  };

  /**
   * Handle user name input change
   */
  const handleUserNameChange = (userName: string) => {
    onFiltersChange({
      ...filters,
      userName: userName.trim() || undefined
    });
  };

  /**
   * Handle date range changes
   */
  const handleDateFromChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateFrom: date || undefined
    });
  };

  const handleDateToChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateTo: date || undefined
    });
  };

  /**
   * Handle sort options change
   */
  const handleSortChange = (sortBy: "relevance" | "date" | "updated" | "alphabetical", sortOrder: "asc" | "desc") => {
    // Default to desc for updated and relevance
    const defaultOrder = (sortBy === "relevance" || sortBy === "updated") ? "desc" : "asc";
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: sortOrder || defaultOrder
    });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    onFiltersChange({
      query: filters.query // Keep the text query
    });
  };

  /**
   * Check if any filters are active (excluding query)
   */
  const hasActiveFilters = Boolean(
    filters.tagsInclude?.length ||
    filters.tagsExclude?.length ||
    filters.userName ||
    filters.dateFrom ||
    filters.dateTo ||
    (filters.sortBy && filters.sortBy !== "relevance" && filters.sortBy !== "updated") ||
    (filters.sortBy === "updated" && filters.sortOrder !== "desc")
  );

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          backgroundColor: isOpen ? "#7b6be5" : "transparent",
          color: isOpen ? "white" : "#7b6be5",
          border: "2px solid #7b6be5",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span>{isOpen ? "▼" : "▶"}</span>
        <span>Advanced Search</span>
        {hasActiveFilters && (
          <span
            style={{
              backgroundColor: isOpen ? "white" : "#7b6be5",
              color: isOpen ? "#7b6be5" : "white",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px",
              marginLeft: "4px"
            }}
          >
            Active
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: "16px",
            padding: "24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Tags Filter - Include */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#333"
              }}
            >
              Include Tags 
            </label>
            {isLoadingTags ? (
              <div style={{ color: "#666", fontSize: "14px" }}>Loading tags...</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}
              >
                {availableTags.map(tag => {
                  const isChecked = filters.tagsInclude?.includes(tag) || false;
                  return (
                    <label
                      key={`include-${tag}`}
                      htmlFor={`include-${tag}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 12px",
                        backgroundColor: isChecked ? "#7b6be5" : "white",
                        color: isChecked ? "white" : "#333",
                        border: `2px solid ${isChecked ? "#7b6be5" : "#ddd"}`,
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <input
                        id={`include-${tag}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleTagIncludeChange(tag, e.target.checked)}
                        style={{ marginRight: "6px", cursor: "pointer" }}
                      />
                      {tag}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tags Filter - Exclude */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#333"
              }}
            >
              Exclude Tags 
            </label>
            {isLoadingTags ? (
              <div style={{ color: "#666", fontSize: "14px" }}>Loading tags...</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}
              >
                {availableTags.map(tag => {
                  const isChecked = filters.tagsExclude?.includes(tag) || false;
                  return (
                    <label
                      key={`exclude-${tag}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 12px",
                        backgroundColor: isChecked ? "#fa7d35ff" : "white",
                        color: isChecked ? "white" : "#333",
                        border: `2px solid ${isChecked ? "#fa7d35ff" : "#ddd"}`,
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleTagExcludeChange(tag, e.target.checked)}
                        style={{
                          marginRight: "6px",
                          cursor: "pointer"
                        }}
                      />
                      {tag}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Name Filter */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333"
              }}
            >
              Filter by User Name
            </label>
            <input
              type="text"
              placeholder="Enter user name..."
              value={filters.userName || ""}
              onChange={(e) => handleUserNameChange(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: "8px 12px",
                fontSize: "14px",
                border: "2px solid #ddd",
                borderRadius: "6px",
                outline: "none"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7b6be5";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
              }}
            />
          </div>

          {/* Date Range Filter */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333"
              }}
            >
              Filter by Date Created
            </label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "4px"
                  }}
                >
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#fa7d35ff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "4px"
                  }}
                >
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#fa7d35ff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333"
              }}
            >
              Sort By
            </label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={filters.sortBy || "relevance"}
                onChange={(e) => {
                  const newSortBy = e.target.value as "relevance" | "date" | "updated" | "alphabetical";
                  const defaultOrder = (newSortBy === "relevance" || newSortBy === "updated") ? "desc" : "asc";
                  handleSortChange(newSortBy, filters.sortOrder || defaultOrder);
                }}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  border: "2px solid #ddd",
                  borderRadius: "6px",
                  outline: "none",
                  cursor: "pointer"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7b6be5";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date Created</option>
                <option value="updated">Last Updated</option>
                <option value="alphabetical">Alphabetical (Title)</option>
              </select>
              {filters.sortBy && filters.sortBy !== "relevance" && (
                <select
                  value={filters.sortOrder || (filters.sortBy === "updated" ? "desc" : "asc")}
                  onChange={(e) =>
                    handleSortChange(
                      filters.sortBy || "date",
                      e.target.value as "asc" | "desc"
                    )
                  }
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#7b6be5";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div>
              <button
                onClick={handleClearFilters}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "2px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#999";
                  e.currentTarget.style.color = "#333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.color = "#666";
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

