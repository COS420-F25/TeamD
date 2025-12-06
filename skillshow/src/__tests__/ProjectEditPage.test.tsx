import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
}));

jest.mock("../firebase-config", () => ({
  db: {},
}));

import { ProjectEditPage } from "../pages/ProjectEditPage";
import { collection, getDocs, addDoc } from "firebase/firestore";

jest.mock("../components/ProjectEditor", () => ({
  ProjectEditor: ({ project, onClose }: any) => (
    <div data-testid="project-editor">
      <h2>Edit Project</h2>
      <p>Editing: {project.title}</p>
      <button onClick={onClose}>Close Editor</button>
    </div>
  ),
}));

describe("ProjectEditPage Firestore sanity", () => {
  const mockUser = { uid: "user123" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test("renders login message when user is null", () => {
    render(<ProjectEditPage user={null} />);
    expect(screen.getByText("Please log in to view projects")).toBeInTheDocument();
  });

  test("renders loading state when user exists", () => {
    render(<ProjectEditPage user={mockUser} />);
    expect(screen.getByText("Loading projects")).toBeInTheDocument();
  });

  test("loads and displays projects from Firestore", async () => {
    const mockProjects = [
      {
        id: "project1",
        data: () => ({
          title: "Test Project 1",
          desc: "Description 1",
          tags: ["react", "typescript"],
          fields: [],
          userId: "user123",
          createdAt: { toDate: () => new Date("2024-01-01") },
        }),
      },
      {
        id: "project2",
        data: () => ({
          title: "Test Project 2",
          desc: "Description 2",
          tags: ["node"],
          fields: [],
          userId: "user123",
          createdAt: { toDate: () => new Date("2024-01-02") },
        }),
      },
    ];

    const mockCollectionRef = { path: "users/user123/projects" };
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockProjects,
    });

    render(<ProjectEditPage user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("Your Projects")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Project 1")).toBeInTheDocument();
    expect(screen.getByText("Test Project 2")).toBeInTheDocument();
    expect(collection).toHaveBeenCalledWith({}, "users", "user123", "projects");
    expect(getDocs).toHaveBeenCalledWith(mockCollectionRef);
  });

  test("creates a new project when New Project button is clicked", async () => {
    const mockNewProjectRef = { id: "new-project-id" };
    const mockCollectionRef = { path: "users/user123/projects" };

    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    (addDoc as jest.Mock).mockResolvedValue(mockNewProjectRef);

    render(<ProjectEditPage user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("Your Projects")).toBeInTheDocument();
    });

    const newProjectButton = screen.getByText("New Project");
    fireEvent.click(newProjectButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        mockCollectionRef,
        expect.objectContaining({
          title: "New Project",
          desc: "",
          tags: [],
          fields: [],
          userId: "user123",
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("project-editor")).toBeInTheDocument();
      expect(screen.getByText("Editing: New Project")).toBeInTheDocument();
    });
  });

  test("opens ProjectEditor when a project is clicked", async () => {
    const mockProjects = [
      {
        id: "project1",
        data: () => ({
          title: "cool proj",
          desc: "A great project",
          tags: ["react"],
          fields: [{ id: "field1", label: "URL", value: "https://example.com" }],
          userId: "user123",
          createdAt: { toDate: () => new Date("2024-01-01") },
        }),
      },
    ];

    const mockCollectionRef = { path: "users/user123/projects" };
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockProjects,
    });

    render(<ProjectEditPage user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("cool proj")).toBeInTheDocument();
    });

    const projectElement = screen.getByText("cool proj");
    fireEvent.click(projectElement);

    await waitFor(() => {
      expect(screen.getByTestId("project-editor")).toBeInTheDocument();
      expect(screen.getByText("Editing: cool proj")).toBeInTheDocument();
    });

    const closeButton = screen.getByText("Close Editor");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("project-editor")).not.toBeInTheDocument();
    });
  });
});