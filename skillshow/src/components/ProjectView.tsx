import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Project } from "../types/Project";

interface ProjectViewProps {
    projectId: string;
    userId: string;
    onClose: () => void;
}

export function ProjectView({ projectId, userId, onClose }: ProjectViewProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const docRef = doc(db, "users", userId, "projects", projectId);
                const docSnap = await getDoc(docRef);
                
                    if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProject({
                        id: docSnap.id,
                        title: data.title ?? "",
                        desc: data.desc ?? "",
                        tags: data.tags ?? [],
                        fields: (data.fields ?? []).map((f: any) => ({
                            id: f.id,
                            label: f.label ?? "",
                            value: f.value ?? ""
                        })),
                        userId: data.userId ?? userId,
                            createdAt: data.createdAt?.toDate?.() ?? new Date(),
                            updatedAt: data.updatedAt?.toDate?.() ?? data.createdAt?.toDate?.() ?? new Date()
                    } as Project);
                } else {
                    setError("Project not found");
                }
            } catch (err) {
                console.error("Error fetching project:", err);
                setError("Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [projectId, userId]);

    if (loading) {
        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "8px",
                    textAlign: "center"
                }}>
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "8px",
                    textAlign: "center"
                }}>
                    <p style={{ color: "red" }}>{error || "Project not found"}</p>
                    <button
                        onClick={onClose}
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#7b6be5",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white",
                width: "90%",
                maxWidth: "900px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                overflow: "hidden"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.5rem",
                    borderBottom: "2px solid #e0e0e0",
                    backgroundColor: "white"
                }}>
                    <h2 style={{ margin: 0, color: "#333" }}>{project.title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1.5rem"
                }}>
                    {/* Description */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ color: "#333", marginTop: 0 }}>Description</h3>
                        <p style={{
                            color: "#666",
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word"
                        }}>
                            {project.desc || "No description provided"}
                        </p>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h3 style={{ color: "#333", marginTop: 0 }}>Tags</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {project.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: "#7b6be5",
                                            color: "white",
                                            padding: "0.4rem 0.8rem",
                                            borderRadius: "20px",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Custom Fields */}
                    {project.fields && project.fields.length > 0 && (
                        <div>
                            <h3 style={{ color: "#333", marginTop: 0 }}>Additional Information</h3>
                            {project.fields.map((field: any) => (
                                <div
                                    key={field.id}
                                    style={{
                                        marginBottom: "1.5rem",
                                        padding: "1rem",
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "4px",
                                        borderLeft: "4px solid #7b6be5"
                                    }}
                                >
                                    <h4 style={{ color: "#333", margin: "0 0 0.5rem 0" }}>
                                        {field.label}
                                    </h4>
                                    <p style={{
                                        color: "#666",
                                        margin: 0,
                                        lineHeight: "1.6",
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word"
                                    }}>
                                        {field.value || "No information provided"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Created Date */}
                    <div style={{
                        marginTop: "2rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid #eee",
                        color: "#999",
                        fontSize: "12px"
                    }}>
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
