import React from "react";
import { auth } from "../firebase-config";

/**
 *   Component that allows users to connect their GitHub account
 *   Redirects to the GitHub OAuth installation flow
 */

const debug = 0

export function ConnectGitHub() {
  const handleConnect = () => {
    // Check if user is authenticated before connecting
    if (!auth.currentUser) {
      alert("Please log in first");
      return;
    }

    /*  URL for local development
        We will need to change this if we ever get to production
    */
    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    const region = process.env.REACT_APP_FUNCTIONS_REGION;
    const port = process.env.REACT_APP_FUNCTIONS_PORT;
    if (debug) {
        console.log("ENV DEBUG:", { projectId, region, port });
    }
    if (!projectId || !region || !port) {
      console.warn("Missing env variables");
    }

    const functionsUrl = `http://127.0.0.1:${port}/${projectId}/${region}`;

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

    if (debug) {
      console.log("ENV DEBUG:", { projectId, region, port });
    }
    if (!projectId || !region || !port) {
      console.warn("Missing env variables");
    }
    // URL for local development
    const functionsUrl = `http://127.0.0.1:${port}/${projectId}/${region}`;

    try {
      // Send a disconnect request
      const response = await fetch(`${functionsUrl}/disconnectGitHub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: auth.currentUser.uid }),
      });

      // Guard against undefined/invalid response
      if (!response) {
        throw new Error("No response from disconnect endpoint");
      }

      // Check if response is ok before parsing
      if (!response.ok) {
        const statusText = response.statusText || `status ${response.status}`;
        throw new Error(`Disconnect failed: ${statusText}`);
      }

      // Safely parse JSON response
      let data: any = null;
      if (typeof response.json === "function") {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error("Invalid response format from server");
        }
      } else {
        throw new Error("Response does not support JSON parsing");
      }

      if (data && data.success) {
        alert("GitHub disconnected successfully");

        // Open GitHub uninstall page in a new tab
        if (data.redirectUrl) {
          window.open(data.redirectUrl, "_blank");
        }
      } else {
        const errorMsg = data?.message || "Unknown error";
        alert(`Failed to disconnect GitHub: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to disconnect GitHub: ${errorMessage}`);
    }
  };

  return <button onClick={handleDisconnect}>Disconnect GitHub</button>;
}
