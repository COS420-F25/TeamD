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
                        createdAt: data.createdAt?.toDate?.() ?? new Date()
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
            createdAt: serverTimestamp()
        });

        await loadProjects();
        setProject({
            id: newProj.id,
            title: "New Project",
            desc: "",
            tags: [],
            fields: [],
            userId: user.uid,
            createdAt: new Date()
        });

    };

    if (!user) {
        return <p>Please log in to view projects</p>;
    }
    if (loading) return <p>Loading projects</p>;

    return (
        <div>
            <h2>Your Projects</h2>
            <button onClick={createProject}>New Project</button>
            {projects.map((x)=>(
                <div key={x.id} onClick={()=>setProject(x)}>{x.title}</div>
            ))}
            {project && (<ProjectEditor user={user} project={project} onClose={()=> setProject(null)} refresh={loadProjects}/>)}
        </div>
    )
        
}
