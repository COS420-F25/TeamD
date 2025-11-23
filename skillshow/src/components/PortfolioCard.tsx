// src/components/PortfolioCard.tsx

import React from "react";
// TODO: Import Portfolio type from types/Portfolio

// TODO: Define PortfolioCardProps interface
// Should include: portfolio (type Portfolio) and onClick (function)

/**
 * TODO: Add component documentation
 * This component displays a single search result card
 */
export function PortfolioCard(/* TODO: Add props here */) {
  return (
    <div
      onClick={/* TODO: Call onClick prop */}
      style={{
        // TODO: Add styling for the card
        // Hint: Should have padding, backgroundColor, borderRadius, cursor
      }}
    >
      {/* TODO: Create user avatar circle */}
      <div
        style={{
          // TODO: Style for circular avatar
          // Hint: width, height, borderRadius: "50%", backgroundColor
        }}
      >
        {/* TODO: Display first letter of user's name */}
      </div>

      {/* TODO: Create user info section */}
      <div style={{ flex: 1 }}>
        {/* TODO: Display user name */}
        <div>{/* User name goes here */}</div>
        
        {/* TODO: Display portfolio title */}
        <div>{/* Portfolio title goes here */}</div>
        
        {/* TODO: Display portfolio description (truncate if > 100 chars) */}
        <div>{/* Portfolio description goes here */}</div>
      </div>
    </div>
  );
}