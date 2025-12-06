import React, { useState, useRef, useEffect } from "react";

/**
 * Predefined tags that users can select from
 */
export const AVAILABLE_TAGS = [
  "React",
  "Node.js",
  "Firebase",
  "UI/UX",
  "TypeScript",
  "Python",
  "Machine Learning",
  "CSS",
  "HTML",
  "JavaScript",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Docker",
  "AWS",
  "Azure",
  "MySQL",
  "GraphQL",
  "REST API",
  "Web Design",
  "Mobile Development",
  "iOS",
  "Android",
  "Git",
  "CI/CD",
  "Testing",
  "DevOps",
  "Agile",
  "Scrum"
];

/**
 * Props for TagSelector component
 */
export interface TagSelectorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

/**
 * TagSelector Component
 * Dropdown with autocomplete for adding tags
 */
export function TagSelector({ tags, setTags }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tags based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredTags(AVAILABLE_TAGS.filter(tag => !tags.includes(tag)));
      return;
    }

    const inputLower = inputValue.toLowerCase();
    const filtered = AVAILABLE_TAGS.filter(
      tag => 
        tag.toLowerCase().includes(inputLower) && 
        !tags.includes(tag)
    );
    setFilteredTags(filtered);
  }, [inputValue, tags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setInputValue("");
      setIsOpen(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredTags.length > 0) {
      e.preventDefault();
      addTag(filteredTags[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      {/* Selected tags display */}
      {tags.length > 0 && (
        <div 
          style={{ 
            display: "flex", 
            gap: "8px", 
            flexWrap: "wrap", 
            marginBottom: "12px"
          }}
        >
          {tags.map(tag => (
            <div
              key={tag}
              onClick={() => removeTag(tag)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ddd",
                borderRadius: "16px",
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tag}</span>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>×</span>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown input */}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          placeholder="Type to search tags..."
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "2px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box"
          }}
        />

        {/* Dropdown list */}
        {isOpen && filteredTags.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "4px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto"
            }}
          >
            {filteredTags.map(tag => (
              <div
                key={tag}
                onClick={() => addTag(tag)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Props for TagDisplay component
 */
export interface TagDisplayProps {
  tags: string[];
}

/**
 * TagDisplay Component
 * Simple display of selected tags
 */
export function TagDisplay({ tags }: TagDisplayProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div 
      style={{ 
        display: "flex", 
        gap: "8px", 
        flexWrap: "wrap"
      }}
    >
      {tags.map(tag => (
        <div
          key={tag}
          style={{
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            borderRadius: "16px",
            fontSize: "13px"
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
