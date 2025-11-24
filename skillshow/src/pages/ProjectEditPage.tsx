//import React, { useState     } from "react";
/*
interface ProjectField {
    id: string;
    name: string;
    value: string;
    maxLength?: number;
    multiline?: boolean;
    width?: string;
    height?: string;
}
*/
export function ProjectEditPage({ user }: {user: any}) {
    
/*
    const [fields, setFields] = useState<ProjectField[]>([
        {
            id: "projectName",
            name: "Project Name",
            value: "",
            maxLength: 100,
            width: "100%"
        },
        {
            id: "position",
            name: "Role / Position",
            value: "",
            maxLength: 150,
            width: "70%"
        },
        {
            id: "summary",
            name: "Short Summary",
            value: "",
            maxLength: 250,
            multiline: true,
            width: "100%"
        },
        {
            id: "tech",
            name: "Technologies Used",
            value: "",
            maxLength: 200,
            width: "100%"
        },
        {
            id: "details",
            name: "Detailed Description",
            value: "",
            multiline: true,
            width: "100%",
            height: "200px"
        }
    ]);
    */

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
