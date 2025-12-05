import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

jest.mock("react-firebase-hooks/auth", () => ({
  useSignInWithGoogle: () => [jest.fn()],
  useAuthState: () => [{ displayName: "Test User" }, false, null],
}));

  test("clicking Profile shows ProfilePage", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Profile"));

    // ProfilePage should render with the user
    expect(screen.getByText(/Edit Profile/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name:")).toBeInTheDocument(); 
    expect(screen.getByLabelText("Title:")).toBeInTheDocument(); 
    expect(screen.getByLabelText("Location:")).toBeInTheDocument(); 
    expect(screen.getByLabelText("Bio:")).toBeInTheDocument(); 
    
  });

  test("clicking Projects shows ProjectEditPage", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Projects"));

    expect(screen.getByText("Edit Project")).toBeInTheDocument();
    expect(screen.getByText("Insert Tags")).toBeInTheDocument();
  });

  test("clicking Search shows SearchPage", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Search"));

    expect(screen.getByText("Search Portfolios")).toBeInTheDocument();
  });

