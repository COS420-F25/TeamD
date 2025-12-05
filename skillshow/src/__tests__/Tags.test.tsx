import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TagSelector, TagDisplay } from "../components/Tags";

describe("Tags Component", () => {
  describe("TagSelector", () => {
    let mockSetTags: jest.Mock;

    beforeEach(() => {
      mockSetTags = jest.fn();
    });

    test("renders input field with placeholder", () => {
      render(<TagSelector tags={[]} setTags={mockSetTags} />);
      
      const input = screen.getByPlaceholderText("Type to search tags...");
      expect(input).toBeInTheDocument();
    });

    test("displays selected tags with remove button", () => {
      const selectedTags = ["React", "TypeScript"];
      render(<TagSelector tags={selectedTags} setTags={mockSetTags} />);
      
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      
      // Check for remove button (× symbol)
      const removeButtons = screen.getAllByText("×");
      expect(removeButtons).toHaveLength(2);
    });

    test("allows adding a tag by clicking from dropdown", async () => {
      render(<TagSelector tags={[]} setTags={mockSetTags} />);
      
      const input = screen.getByPlaceholderText("Type to search tags...") as HTMLInputElement;
      
      // Focus on input to show dropdown
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "React" } });
      
      // Wait for dropdown to appear and click on the tag
      await waitFor(() => {
        const dropdownOption = screen.getByText("React");
        expect(dropdownOption).toBeInTheDocument();
      });
      
      const dropdownOption = screen.getByText("React");
      fireEvent.click(dropdownOption);
      
      // Verify setTags was called with the new tag
      expect(mockSetTags).toHaveBeenCalledWith(["React"]);
    });

    test("allows removing a tag by clicking the remove button", () => {
      const selectedTags = ["React", "TypeScript"];
      render(<TagSelector tags={selectedTags} setTags={mockSetTags} />);
      
      // Find the remove buttons - click the first one (for React)
      const removeButtons = screen.getAllByText("×");
      const firstRemoveButton = removeButtons[0];
      
      // Click the remove button (×) for the first tag (React)
      fireEvent.click(firstRemoveButton);
      
      // Verify setTags was called with React removed
      expect(mockSetTags).toHaveBeenCalledWith(["TypeScript"]);
    });
  });

  describe("TagDisplay", () => {
    test("displays all tags when provided", () => {
      const tags = ["React", "TypeScript", "Node.js"];
      render(<TagDisplay tags={tags} />);
      
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
  });
});
