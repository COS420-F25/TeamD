import React, {useEffect, useState, useCallback} from "react";
import {db} from "../firebase-config";
import {User} from "firebase/auth";
import {collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ProjectEditor } from "../components/ProjectEditor";
//import { TagSelector } from "../components/Tags";
import { Project } from "../types/Project";

interface ProjectEditPageProps{
    user: User | null;
}


export function ProjectEditPage({ user }:ProjectEditPageProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    
    const loadProjects = useCallback(async() => {
        if (!user) {
            setLoading(false);
            return;
        }   
            try {
                const colRef = collection(db,"users",user.uid, "projects");
                const colSnap = await getDocs(colRef);
                const colList = colSnap.docs.map((x) => {
                    const data = x.data();
                    return {
                        id: x.id,
                        title: data.title ?? "",
                        desc: data.desc ?? "",
                        tags: data.tags ?? [],
                        fields: (data.fields ?? []).map((f: any) => ({
                        id: f.id,
                        label: f.label ?? "",
                        value: f.value ?? ""
                        })),
                        userId: data.userId ?? user.uid,
                        createdAt: data.createdAt?.toDate?.() ?? new Date(),
                        updatedAt: data.updatedAt?.toDate?.() ?? data.createdAt?.toDate?.() ?? new Date()
                    } as Project;
                });

                setProjects(colList);
                return colList;
                
            } catch (err){
                console.error("Error fetching projects:", err);
                return [];
            }

        },[user]);
    useEffect(() => {
        if  (!user) return;

        setLoading(true);
        loadProjects().finally(() => setLoading(false));
    },[user,loadProjects]);

    

    const createProject = async() => {
        
        if (!user) return;
        const colRef = collection(db,"users",user.uid, "projects");
        const newProj = await addDoc(colRef,{
            title:"New Project",
            desc:"",
            tags:[],
            fields:[],
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        setLoading(true);
  
        const updated = await loadProjects();
        const created = updated?.find(p => p.id === newProj.id) ?? null;
        setProject(created);
        setLoading(false);
    };

    if (!user) {
        return <p>Please log in to view projects</p>;
    }
    if (loading) return <p>Loading projects</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ marginTop: 0 }}>Your Projects</h2>
            <button 
                onClick={createProject}
                style={{
                    marginBottom: "1.5rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#7b6be5",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px"
                }}
            >
                New Project
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "800px" }}>
                {projects.map((proj) => (
                    <div
                        key={proj.id}
                        onClick={() => setProject(proj)}
                        style={{
                            backgroundColor: "#FFDAB3",
                            padding: "1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            border: "2px solid transparent",
                            transition: "all 0.2s ease",
                            minHeight: "auto"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#FFD5A3";
                            e.currentTarget.style.borderColor = "#7b6be5";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FFDAB3";
                            e.currentTarget.style.borderColor = "transparent";
                        }}
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "0.5rem"
                            }}
                        >
                            {proj.title}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                lineHeight: "1.4",
                                marginBottom: "0.5rem"
                            }}
                        >
                            {proj.desc.length > 60
                                ? proj.desc.substring(0, 60) + "..."
                                : proj.desc || "No description"}
                        </div>
                        {proj.tags && proj.tags.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.3rem",
                                    marginTop: "0.5rem"
                                }}
                            >
                                {proj.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: "#7b6be5",
                                            color: "white",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "12px",
                                            fontSize: "10px",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {proj.tags.length > 3 && (
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            color: "#666",
                                            alignSelf: "center",
                                            marginLeft: "0.2rem"
                                        }}
                                    >
                                        +{proj.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {project && (<ProjectEditor user={user} project={project} onClose={()=> setProject(null)} refresh={loadProjects}/>)}
        </div>
    )
        
}
