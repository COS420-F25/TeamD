import React from "react";
import { auth } from "../firebase-config";

/**
 *   Component that allows users to connect their GitHub account
 *   Redirects to the GitHub OAuth installation flow
 */


export function ConnectGitHub() {
  const handleConnect = () => {
    // Check if user is authenticated before connecting
    if (!auth.currentUser) {
      alert("Please log in first");
      return;
    }

    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    const region = process.env.REACT_APP_FUNCTIONS_REGION;
    const port = process.env.REACT_APP_FUNCTIONS_PORT;

    if (!projectId || !region) {
      console.warn("Missing env variables");
    }

    // Use localhost for development, production URL for deployment
    const functionsUrl = window.location.hostname === "localhost"
      ? `http://127.0.0.1:${port}/${projectId}/${region}`
      : `https://${region}-${projectId}.cloudfunctions.net`;

    // Redirect the user to the git auth flow with userId
    window.location.href = `${functionsUrl}/githubInstall?userId=${auth.currentUser.uid}`;
  };

  return (
    <div>
      <h2>Connect Your GitHub Account</h2>
      <button onClick={handleConnect}>Connect GitHub</button>
    </div>
  );
}

/**
 * Component that allows users to disconnect their GitHub account
 * Removes the GitHub integration and revokes access
 */
export function DisconnectGitHub() {
  const handleDisconnect = async () => {
    // Check if user is authenticated before trying to disconnect
    if (!auth.currentUser) {
      alert("Please log in first");
      return;
    }

    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    const region = process.env.REACT_APP_FUNCTIONS_REGION;
    const port = process.env.REACT_APP_FUNCTIONS_PORT;

    if (!projectId || !region) {
      console.warn("Missing env variables");
    }

    // Use localhost for development, production URL for deployment
    const functionsUrl = window.location.hostname === "localhost"
      ? `http://127.0.0.1:${port}/${projectId}/${region}`
      : `https://${region}-${projectId}.cloudfunctions.net`;

    try {
      // Send a disconnect request
      const response = await fetch(`${functionsUrl}/disconnectGitHub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: auth.currentUser.uid }),
      });

      const data = await response.json();

      if (data.success) {
        alert("GitHub disconnected successfully");

        // Open GitHub uninstall page in a new tab
        if (data.redirectUrl) {
          window.open(data.redirectUrl, "_blank");
        }
      } else {
        alert("Failed to disconnect GitHub.");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      alert("Failed to disconnect GitHub");
    }
  };

  return <button onClick={handleDisconnect}>Disconnect GitHub</button>;
}
