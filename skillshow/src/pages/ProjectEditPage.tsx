import React from "react";

export function ProjectEditPage({ user }: {user: any}) {
    if (!user) {
        return <h2>You must be logged in</h2>
    }
    return (
        <div style={{ padding: 20}}>
            <h1> Edit Project </h1>
            <p>This is a placeholder for Edit Project page</p>
        </div>
    )
}
