import React, { useState } from "react";
import { Form } from "react-bootstrap";

// Current pdf examples must be removed if this project moves forward in a non academic scenario as these are internet sourced
const PRESET_RESUMES = [
    { id: 1, name: "Database Engineer Resume", path: "/resumes/database-engineer.pdf"},
    { id: 2, name: "Software Engineer Resume", path: "/resumes/software-engineer.pdf"},
    { id: 3, name: "Senior Software Engineer Resume", path: "/resumes/Sr-software-engineer.pdf"}
];

// import {db} from '../firebase-config'
// import { getStorage, ref, uploadBytes } from 'firebase/storage';


export function UploadResume(): React.JSX.Element {    
    // I think we might need to upgrade our firebase plan to use their storage components
    // So I'll set it up locally instead for now.

    const [file, setFile] = useState<File | null>(null);
    const [selectedPreset, setPreset] = useState<string>("");
    const [resumeSource, setResumeSource] = useState<"upload" | "preset">("upload");
    const [showMenu, setShowMenu] = useState(false);

    
    function updateFile(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files && event.target.files[0]){
            setFile(event.target.files[0]);
            setResumeSource("upload");
            setPreset("");
        }
    }

    function handlePresetSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const presetPath = event.target.value;
        setPreset(presetPath);
        setResumeSource("preset");
        setFile(null);
    }

    function downloadFile(){
        if (resumeSource === "upload" && file) {
            // Make a download link
            const url = URL.createObjectURL(file);
            const link = document.createElement('a')
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        else if (resumeSource === "preset" && selectedPreset){
            const link = document.createElement('a')
            link.href = selectedPreset;
            link.download = selectedPreset.split('/').pop() || 'resume.pdf';
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link);
        }
    }

    const hasResume =   (resumeSource === "upload" && file) ||
                        (resumeSource === "preset" && selectedPreset);

    if (!showMenu) {
        // Show preview card if resume is selected, otherwise show "Insert New Resume" button
        if (hasResume) {
            const resumeName = resumeSource === "upload" && file 
                ? file.name 
                : PRESET_RESUMES.find(p => p.path === selectedPreset)?.name || "Resume";

            return (
                <div 
                    onClick={() => setShowMenu(true)}
                    // Resume selected button styling
                    style={{
                        marginTop: "2rem",
                        border: "2px solid #ddd",
                        width: "25%",
                        aspectRatio: "1",  // Makes it square
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                    {/* Purple preview area */}
                    <div style={{
                        background: "#d4c5f9",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    </div>
                    
                    {/* Resume info area */}
                    <div style={{
                        background: "white",
                        padding: "1rem"
                    }}>
                        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>{resumeName}</h4>
                        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                            Click to edit or change resume
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <button 
                onClick={() => setShowMenu(true)}
                // Nothing selected button styling
                style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "25%",
                    aspectRatio: "1",  // Makes it square
                    padding: "5rem",
                    border: "2px dashed #ccc",
                    borderRadius: "5px",
                    background: "#f8f9fa",
                    cursor: "pointer"
                }}
            >
                <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    color: "white",
                    marginBottom: "0.5rem"
                }}>
                </div>
                <span style={{ color: "#999", fontSize: "1.1rem" }}>Insert New Resume</span>
            </button>
        );
    }
        return (
            <div style={{ padding: "1rem" }}>
                <h3>Resume Management</h3>
                
                {/* Preset Resume */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <Form.Group controlId="presetSelect">
                        <Form.Label><strong> Choose a Preset Resume </strong></Form.Label>
                        <Form.Select 
                            value={selectedPreset} 
                            onChange={handlePresetSelect}
                            style={{ maxWidth: "400px" }}
                        >
                            <option value="">-- Select a preset resume --</option>
                            {PRESET_RESUMES.map(preset => (
                                <option key={preset.id} value={preset.path}>
                                    {preset.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>

                {/* Divider */}
                <div style={{ 
                    borderTop: "2px solid #ddd", 
                    margin: "1rem 0",
                    position: "relative"
                }}>
                    <span style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "white",
                        padding: "0 10px",
                        color: "#666"
                    }}>OR</span>
                </div>

                {/* Upload Resume */}
                <div style={{ marginTop: "1.5rem" }}>
                    <Form.Group controlId="resumeForm">
                        <Form.Label><strong> Upload Your Own Resume </strong></Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={updateFile}
                            accept=".pdf,.doc,.docx"
                        />
                    </Form.Group>
                </div>

                {/* Display Current Selection */}
                <div style={{ 
                    marginTop: "1rem", 
                    padding: "1rem", 
                    background: "#f8f9fa",
                    borderRadius: "5px",
                    border: "1px solid #dee2e6"
                }}>
                    <strong>Current Selection:</strong>
                    {resumeSource === "upload" && file ? (
                        <div style={{ marginTop: "0.5rem" }}>
                            Uploaded: {file.name}
                        </div>
                    ) : resumeSource === "preset" && selectedPreset ? (
                        <div style={{ marginTop: "0.5rem" }}>
                            Preset: {PRESET_RESUMES.find(p => p.path === selectedPreset)?.name}
                        </div>
                    ) : (
                        <div style={{ marginTop: "0.5rem", color: "#666" }}>
                            No resume selected
                        </div>
                    )}
                </div>

                {/* Download Button */}
                {hasResume && (
                    <button 
                        onClick={downloadFile}
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem 1.5rem",
                            background: "#a9e",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Download Resume
                    </button>
                )}
            {/* Back Button */}
            <button 
                onClick={() => setShowMenu(false)}
                style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Back
            </button>
        </div>
    );
}
