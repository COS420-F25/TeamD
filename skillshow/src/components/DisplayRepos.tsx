import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { GitHubRepoService, Repository } from "../services/GitHubRepoService";

export function DisplayRepos() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GitHubService = new GitHubRepoService();

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const userID = auth.currentUser?.uid;
      if (!userID) {
        setError("Please log in first");
        setLoading(false);
        return;
      }

      // Get the installattion ID for the user to display repo
      const userDoc = await getDoc(doc(db, "users", userID));
      const userData = userDoc.data();

      const installationID = userData?.githubInstallationId;
      if (!installationID) {
        setIsConnected(false);
        setLoading(false);
        return;
      }

      setIsConnected(true);

      // Get reposistories from GitHub
      const repositories = await GitHubService.getRepositories(installationID);
      setRepos(repositories);
    } catch (err) {
      console.error("Error loading repositories:", err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading repositories...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isConnected) {
    return (
      <div>
        <span>GitHub not connected</span>
      </div>
    );
  }
  return (
    <div style={{padding: ".25in"}}>
      <h2>Your GitHub Repositories ({repos.length})</h2>
      <div style={{ display: "grid", gap: ".15in", maxWidth: "600px" }}>
        {repos.map((repo) => (
          <div
            key={repo.id}
            style={{
              border: "4px solid #ca7300ff",
              padding: ".2in",
              borderRadius: "6px",
            }}
          >
            <h3>
                {/* Open in a new tab without any refferrer info */}
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.fullName}
              </a>
            </h3>
            {repo.description && <p>{repo.description}</p>}
            <div
              style={{
            
                display: "flex",
                gap: ".25in",
                fontSize: "1.3",
                color: "#4f0381ff",
                backgroundColor: "#f58c15ff",
              }}
            >
              {repo.language && <span>Languages: {repo.language}</span>}
              <span>Stars: {repo.stars}</span>
              {repo.private && <span>Private</span>}
              
            </div>

          </div>
        ))}
      </div>
    </div>
  );
  
}
