// src/__tests__/SearchPage.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// TODO: Import SearchPage component
// TODO: Import SearchService

// TODO: Mock the SearchService
jest.mock("../services/SearchService");

describe("SearchPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  // TODO: Test 1 - Component renders without crashing
  test("renders SearchPage without crashing", () => {
    // TODO: Render SearchPage
    // TODO: Check if "Search Portfolios" text appears
  });

  // TODO: Test 2 - Search input and button are displayed
  test("displays search input and button", () => {
    // TODO: Render SearchPage
    // TODO: Check if search input exists
    // TODO: Check if search button exists
  });

  // TODO: Test 3 - Updates input value when typing
  test("updates search input value when typing", () => {
    // TODO: Render SearchPage
    // TODO: Find search input
    // TODO: Fire change event with value "weather app"
    // TODO: Assert input value changed
  });

  // TODO: Test 4 - Performs search when button clicked
  test("performs search when search button is clicked", async () => {
    // TODO: Create mock search results
    // TODO: Mock SearchService to return results
    // TODO: Render SearchPage
    // TODO: Type in search input
    // TODO: Click search button
    // TODO: Wait for results to appear
    // TODO: Assert results are displayed
  });

  // TODO: Test 5 - Shows loading state during search
  test("shows loading state during search", async () => {
    // TODO: Mock SearchService with delayed response
    // TODO: Render SearchPage
    // TODO: Trigger search
    // TODO: Assert "Searching..." or "Loading" appears
  });

  // TODO: Test 6 - Shows "no results" when search returns empty
  test("shows 'no results' message when search returns empty", async () => {
    // TODO: Mock SearchService to return empty array
    // TODO: Render and search
    // TODO: Assert "No portfolios found" message appears
  });
});