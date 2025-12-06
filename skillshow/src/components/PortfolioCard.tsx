// src/components/PortfolioCard.tsx

import React, { useEffect, useState } from "react";
// TODO: Import Portfolio type from types/Portfolio
import { Project } from "../types/Project";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
// TODO: Define PortfolioCardProps interface
// Should include: portfolio (type Portfolio) and onClick (function)
interface PortfolioCardProps {
  project: Project;
  portfolioId: string;
  onClick: () => void;
}
/**
 * TODO: Add component documentation
 * This component displays a single search result card
 */
export function PortfolioCard({ project, portfolioId, onClick }: PortfolioCardProps) {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    async function loadUser() {
      try {
        const userRef = doc(db, "users", project.userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.name ?? "Unknown User");
        } else {
          setUserName("Unknown User");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setUserName("Unknown User");
      }
    }
    loadUser();
  }, [project.userId]);

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
      {/* User Avatar Circle */}
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#666",
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
        {userName.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px" }}>
          {userName}
        </div>
        <div style={{ fontSize: "14px", color: "#444" }}>
          {project.title}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {project.desc.length > 100
            ? project.desc.substring(0, 100) + "..."
            : project.desc}
        </div>
      </div>
    </div>
  );
}