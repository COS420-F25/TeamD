import React, {useEffect, useState, useRef} from "react";
import {db} from "../firebase-config";
import {User} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Project } from "../types/Project";
import { TagSelector } from "./Tags";


interface ProjectEditorProps{
    user: User;
    project: Project;
    refresh: ()=>Promise<any>;
    onClose: ()=>void;
}

interface HistoryState {
    data: Project;
}

export function ProjectEditor({user, project, onClose, refresh}: ProjectEditorProps){
    const [data, setData] = useState(project);
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState<HistoryState[]>([{ data: project }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [newFieldLabel, setNewFieldLabel] = useState("");
    const [showInsertElement, setShowInsertElement] = useState(false);
    const insertElementRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        const normalized = normalize(project);
        setData(normalized);
        setHistory([{ data: normalized }]);
        setHistoryIndex(0);
    }, [project]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (insertElementRef.current && !insertElementRef.current.contains(event.target as Node)) {
                setShowInsertElement(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const normalize = (p: Project): Project => ({
        id: p.id,
        title: p.title ?? "",
        desc: p.desc ?? "",
        tags: p.tags ?? [],
        fields: p.fields ?? [],
        userId: p.userId,
        createdAt: p.createdAt,
        updatedAt: (p as any).updatedAt ?? p.createdAt
    });

    const addToHistory = (newData: Project) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ data: newData });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const updateData = (newData: Project) => {
        setData(newData);
        addToHistory(newData);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex].data);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex].data);
        }
    };

    const save = async () => {
        if (!user) {
            alert("Please log in first");
            return;
        }
        setSaving(true);
        const ref = doc(db, "users", user.uid, "projects", project.id);
        try {
            await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
            await refresh();
            alert("Project saved successfully");
        } catch (err) {
            alert("Failed to save project");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const saveAndExit = async () => {
        await save();
        onClose();
    };

    const updateTags = (tags: string[]) => {
        updateData({ ...data, tags });
    };

    const addField = (label?: string) => {
        const fieldLabel = label || newFieldLabel.trim() || "New Text Field";
        if (!fieldLabel.trim()) {
            return;
        }
        const id = crypto.randomUUID();
        const newData = {
            ...data,
            fields: [...data.fields, { id, label: fieldLabel, value: "" }]
        };
        updateData(newData);
        setNewFieldLabel("");
        setShowInsertElement(false);
    };

    const updateField = (id: string, value: string) => {
        const newData = {
            ...data,
            fields: data.fields.map((x: any) => 
                x.id === id ? { ...x, value, label: x.label ?? "" } : x
            ),
        };
        updateData(newData);
    };

    const updateFieldLabel = (id: string, label: string) => {
        const newData = {
            ...data,
            fields: data.fields.map((x: any) => 
                x.id === id ? { ...x, label } : x
            ),
        };
        updateData(newData);
    };

    const removeField = (id: string) => {
        const newData = {
            ...data,
            fields: data.fields.filter((f: any) => f.id !== id)
        };
        updateData(newData);
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return(
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
                maxWidth: "1200px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                overflow: "visible"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    borderBottom: "2px solid #e0e0e0",
                    backgroundColor: "white"
                }}>
                    {/* Insert Element Dropdown */}
                    <div style={{ position: "relative" }} ref={insertElementRef}>
                        <button
                            onClick={() => setShowInsertElement(!showInsertElement)}
                            style={{
                                padding: "0.5rem 1rem",
                                border: "2px solid #7b6be5",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                color: "#7b6be5",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            Insert Element
                            <span style={{ fontSize: "12px" }}>▼</span>
                        </button>
                        {showInsertElement && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                marginTop: "0.25rem",
                                backgroundColor: "white",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                zIndex: 1001,
                                minWidth: "200px"
                            }}>
                                <div
                                    onClick={() => addField("Brief Description")}
                                    style={{
                                        padding: "0.75rem 1rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                >
                                    Add Text Field
                                </div>
                                <div
                                    onClick={() => {
                                        const label = prompt("Enter field label:");
                                        if (label) addField(label);
                                    }}
                                    style={{
                                        padding: "0.75rem 1rem",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                >
                                    Custom Field...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Undo | Redo */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#666",
                        fontSize: "14px"
                    }}>
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: canUndo ? "pointer" : "not-allowed",
                                color: canUndo ? "#666" : "#ccc",
                                fontSize: "18px",
                                padding: "0.25rem"
                            }}
                            title="Undo"
                        >
                            ↶
                        </button>
                        <span>Undo | Redo</span>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: canRedo ? "pointer" : "not-allowed",
                                color: canRedo ? "#666" : "#ccc",
                                fontSize: "18px",
                                padding: "0.25rem"
                            }}
                            title="Redo"
                        >
                            ↷
                        </button>
                    </div>

                    {/* Save Buttons */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={save}
                            disabled={saving}
                            style={{
                                padding: "0.5rem 1.5rem",
                                backgroundColor: "#7b6be5",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: saving ? "not-allowed" : "pointer",
                                fontWeight: "500",
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={saveAndExit}
                            disabled={saving}
                            style={{
                                padding: "0.5rem 1.5rem",
                                backgroundColor: "#7b6be5",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: saving ? "not-allowed" : "pointer",
                                fontWeight: "500",
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            Save & Exit
                        </button>
                    </div>
                </div>

                {/* Main Content Area with Orange Border */}
                <div style={{
                    flex: 1,
                    padding: "2rem",
                    border: "2px solid #fa7d35",
                    margin: "1.5rem",
                    borderRadius: "8px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    minHeight: 0
                }}>
                    {/* Project Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => updateData({ ...data, title: e.target.value })}
                            placeholder="Project Title"
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                border: "none",
                                outline: "none",
                                flex: 1,
                                padding: "0.5rem"
                            }}
                        />
                    </div>

                    {/* Brief Description */}
                    <div style={{ position: "relative" }}>
                        <textarea
                            value={data.desc}
                            onChange={(e) => updateData({ ...data, desc: e.target.value })}
                            placeholder="Add Text (Brief description of project)"
                            style={{
                                width: "90%",
                                minHeight: "100px",
                                padding: "1rem",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    {/* Detailed Description */}
                    <div style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
                        <textarea
                            value={data.fields.find((f: any) => f.label === "Detailed Description")?.value || ""}
                            onChange={(e) => {
                                const detailedField = data.fields.find((f: any) => f.label === "Detailed Description");
                                if (detailedField) {
                                    updateField(detailedField.id, e.target.value);
                                } else {
                                    const id = crypto.randomUUID();
                                    updateData({
                                        ...data,
                                        fields: [...data.fields, { id, label: "Detailed Description", value: e.target.value }]
                                    });
                                }
                            }}
                            placeholder="Add Text (More in depth Description with info on dependencies, maybe the README?)"
                            style={{
                                flex: 1,
                                
                                minHeight: "200px",
                                padding: "1rem",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            paddingTop: "0.5rem"
                        }}>
                            <button
                                onClick={() => {
                                    const detailedField = data.fields.find((f: any) => f.label === "Detailed Description");
                                    if (detailedField) {
                                        removeField(detailedField.id);
                                    }
                                }}
                                style={{
                                    padding: "0.5rem",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    color: "#999",
                                    fontSize: "16px"
                                }}
                                title="Delete"
                            >
                
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Text Fields */}
                    {data.fields
                        .filter((f: any) => f.label !== "Detailed Description")
                        .map((field: any) => (
                            <div key={field.id} style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "flex-start"
                            }}>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                                        placeholder="Field Label"
                                        style={{
                                            padding: "0.5rem",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            fontSize: "14px"
                                        }}
                                    />
                                    <textarea
                                        value={field.value}
                                        onChange={(e) => updateField(field.id, e.target.value)}
                                        placeholder="Field content"
                                        style={{
                                            minHeight: "80px",
                                            padding: "1rem",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            fontSize: "14px",
                                            fontFamily: "inherit",
                                            resize: "vertical"
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => removeField(field.id)}
                                    style={{
                                        padding: "0.5rem",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: "#999",
                                        fontSize: "16px"
                                    }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                </div>
                  
                {/* Footer */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    borderTop: "2px solid #e0e0e0",
                    backgroundColor: "white",
                    flexShrink: 0,
                    minHeight: "auto"
                }}>
                    {/* Insert Tags */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <label style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#333"
                        }}>
                            Insert Tags
                        </label>
                        <TagSelector tags={data.tags} setTags={updateTags} />
                    </div>
{/*     
                    Connect GitHub Repository
                    <div>
                        <button
                            onClick={() => {
                                // Use ConnectGitHub functionality
                                const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
                                const region = process.env.REACT_APP_FUNCTIONS_REGION;
                                const port = process.env.REACT_APP_FUNCTIONS_PORT;
                                const functionsUrl = `http://127.0.0.1:${port}/${projectId}/${region}`;
                                window.location.href = `${functionsUrl}/githubInstall?userId=${user.uid}`;
                            }}
                            style={{
                                padding: "0.5rem 1.5rem",
                                backgroundColor: "#7b6be5",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            <span>🔗</span>
                            Connect GitHub Repository
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
        
    );
}
