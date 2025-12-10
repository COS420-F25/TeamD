import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GitHubService } from "./services/githubService";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/*
  Helpful status codes

  200 OK - standard success response
  201 Created - new resource was createdD
  202 Accepted - Request accepted but not processed
  204 No content - Success but no data to return
  400 Bad request - Invalid request syntax or parameters
  500 Internal server error - generic server error

*/
const debug = 0;

// Initializes firebase Admin SDK for firestore and auth services
admin.initializeApp();

// Initialize GitHub Service
const getGitHubService = () => {
  const appId = process.env.GITHUB_APP_ID;

  if (!appId) {
    throw new Error("GitHub App ID not configured");
  }

  return new GitHubService(appId, "");
};

// Redirect to GitHub App installation
export const githubInstall = functions.https.onRequest((req, res) => {
  const appName = process.env.GITHUB_APP_NAME;
  if (!appName) {
    throw new Error("GitHub App name not configured");
  }
  const userId = req.query.userId as string;

  // Pass userId as state parameter so GitHub will return it in the callback
  const redirectUrl = userId ?
    `https://github.com/apps/${appName}/installations/new?state=${userId}` :
    `https://github.com/apps/${appName}/installations/new`;

  res.redirect(redirectUrl);
});

// Handle GitHub callback after installation
export const githubCallback = functions.https.onRequest(async (req, res) => {
  if (debug) {
    console.log("Query parameters:", req.query);
  }
  const { installation_id, setup_action } = req.query;
  if (setup_action === "install" && installation_id) {
    // Get userId from query parameter
    const userId = req.query.state as string;

    if (debug) {
      console.log("Installation ID:", installation_id);
      console.log("User ID from state:", userId);
    }

    // Save to Firestore if there is a user ID
    if (userId) {
      try {
        await admin.firestore().collection("users").doc(userId).set(
          {
            githubInstallationId: installation_id,
            githubConnectedAt: Timestamp.now(),
            // Don't overwrite existing users
          },
          { merge: true }
        );

        if (debug) {
          console.log(
            `Saved installation ${installation_id} for user ${userId}`
          );
        }
      } catch (error) {
        console.error("Error saving installation:", error);
      }
    }

    // Determine app URL based on environment
    const url = process.env.APP_URL || "https://cos420-f25.github.io/TeamD";

    res.redirect(
      `${url}/?github=connected&installation_id=${installation_id}`
    );
  } else {
    const url = process.env.APP_URL || "https://cos420-f25.github.io/TeamD";
    res.redirect(`${url}/?github=failed`);
  }
});

// Get user's repositories
export const getRepositories = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const installationId = req.query.installation_id as string;

    if (!installationId) {
      res.status(400).json({ error: "installation_id required" });
      return;
    }

    const githubService = getGitHubService();
    const repos = await githubService.getUserRepositories(
      parseInt(installationId)
    );

    res.json({ repositories: repos });
  } catch (error: any) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({
      error: "Failed to fetch repositories",
      message: error.message,
    });
  }
});

// Disconnect GitHub
export const disconnectGitHub = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }

    // Remove installation info from Firestore
    await admin.firestore().collection("users").doc(userId).update({
      githubInstallationId: FieldValue.delete(),
      githubConnectedAt: FieldValue.delete(),
    });

    // Build uninstall redirect link
    const appName = process.env.GITHUB_APP_NAME;
    const redirectUrl = `https://github.com/apps/${appName}`;

    // If the request came directly from a browser, redirect
    if (req.get("accept")?.includes("text/html")) {
      res.redirect(redirectUrl);
    } else {
      // Otherwise, send JSON back to frontend
      res.json({
        success: true,
        message: "GitHub disconnected",
        redirectUrl,
      });
    }
  } catch (error: any) {
    console.error("Error disconnecting GitHub:", error);
    res.status(500).json({ error: "Failed to disconnect GitHub" });
  }
});
