// src/components/PortfolioCard.tsx

import React from "react";
// TODO: Import Portfolio type from types/Portfolio
import { Portfolio } from "../types/Portfolio";
// TODO: Define PortfolioCardProps interface
// Should include: portfolio (type Portfolio) and onClick (function)
interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: () => void;
}
/**
 * TODO: Add component documentation
 * This component displays a single search result card
 */
export function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
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
        {portfolio.userName.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px" }}>
          {portfolio.userName}
        </div>
        <div style={{ fontSize: "14px", color: "#444" }}>
          {portfolio.title}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {portfolio.description.length > 100
            ? portfolio.description.substring(0, 100) + "..."
            : portfolio.description}
        </div>
      </div>
    </div>
  );
}