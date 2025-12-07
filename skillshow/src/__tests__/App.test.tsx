import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

jest.mock("react-firebase-hooks/auth", () => ({
  useSignInWithGoogle: () => [jest.fn()],
  useAuthState: () => [{ uid: "test-uid", displayName: "Test User" }, false, null],
}));

// Mock firebase-config to prevent initialization issues in tests
jest.mock("../firebase-config", () => ({
  auth: {
    currentUser: { uid: "test-uid", displayName: "Test User" },
    signOut: jest.fn(),
  },
  db: {},
  app: {},
  initFirebase: jest.fn(),
  getAuthInstance: jest.fn(() => ({
    currentUser: { uid: "test-uid", displayName: "Test User" },
    signOut: jest.fn(),
  })),
  getDbInstance: jest.fn(() => ({})),
}));

// Mock Firestore functions used by ProfilePage
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({
      name: "Test User",
      title: "Tester",
      location: "Nowhere",
      bio: "Bio",
      contact: "test@test.com",
      pfpUrl: "",
      tags: []
    })
  })),
  setDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: []
  }))
}));

// Mock Firebase Storage
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve("https://example.com/image.jpg"))
}));

  test("clicking Profile shows ProfilePage", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Profile"));

    // ProfilePage should render with the user - wait for async Firestore load
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/)).toBeInTheDocument();
    });
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

