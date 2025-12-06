import React, { useState } from "react";
import { TagSelector } from "../components/Tags";

export function ProjectEditPage({ user }: {user: any}) {
    const [tags, setTags] = useState<string[]>([]);

    if (!user) {
        return <h2>You must be logged in</h2>
    }

    return (
        <div style={{ 
            padding: 20
        }}>
            <h1> Edit Project </h1>

            
            {/* Tags section */}
            <div style={{
                marginTop: "2rem",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start"
            }}>
                <div style={{ 
                    width: "100%",
                    maxWidth: "400px"
                }}>
                    <label style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "bold"
                    }}>
                        Insert Tags
                    </label>
                    <TagSelector tags={tags} setTags={setTags} />
                </div>
            </div>
        </div>
    )
}
