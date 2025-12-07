// src/components/ProjectCard.tsx

import React from "react";
import { Project } from "../types/Project";

interface ProjectCardProps {
  project: Project;
  portfolioId: string;
  onClick: () => void;
}

/**
 * ProjectCard Component
 * Displays a single project search result
 * Shows project title, description, and owner info
 */
export function ProjectCard({ project, portfolioId, onClick }: ProjectCardProps) {
  // Get first letter for avatar (from project owner's ID or title)
  const avatarLetter = project.title.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#FFDAB3",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "12px",
        border: "2px solid transparent",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#FFD5A3";
        e.currentTarget.style.borderColor = "#7b6be5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#FFDAB3";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      {/* Project Avatar Circle */}
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#7b6be5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "16px",
          flexShrink: 0,
          color: "white",
          fontWeight: "bold",
          fontSize: "20px"
        }}
      >
        {avatarLetter}
      </div>

      {/* Project Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px", color: "#333" }}>
          {project.title}
        </div>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
          Portfolio ID: {portfolioId}
        </div>
        <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.4" }}>
          {project.desc.length > 120
            ? project.desc.substring(0, 120) + "..."
            : project.desc}
        </div>
        {project.tags && project.tags.length > 0 && (
          <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {project.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: "3px 8px",
                  backgroundColor: "#7b6be5",
                  color: "white",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}