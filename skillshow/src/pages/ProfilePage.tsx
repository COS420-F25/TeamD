import React, {useEffect, useState, useCallback} from "react";
import {db} from "../firebase-config";
import {doc, getDoc, setDoc, collection, getDocs} from "firebase/firestore";
import {User} from "firebase/auth";
import { DisplayRepos } from "../components/DisplayRepos";
import { ConnectGitHub, DisconnectGitHub } from "../components/ConnectGitHub"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { UploadResume } from "../components/ResumeHandling"
import { TagSelector } from "../components/Tags"
import { Project } from "../types/Project";
import { ProjectView } from "../components/ProjectView";

interface ProfilePageProps{
    user: User | null;
}

export function ProfilePage({user}:ProfilePageProps): React.JSX.Element {
    const [profile, setProfile] = useState({ name: "", bio: "" , pfpUrl: "", title: "", contact:"", location:""});
    const [tags, setTags] = useState<string[]>([]);
    const [pfpFile, setPfpFile] = useState<File | null> (null); 
    const [loading, setLoading] = useState(true);
    const [isGitHubConnected, setIsGitHubConnected] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<{ id: string; userId: string } | null>(null);

    // Load projects from Firestore
    const loadProjects = useCallback(async () => {
        if (!user) {
            setProjectsLoading(false);
            return;
        }
        try {
            const colRef = collection(db, "users", user.uid, "projects");
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
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setProjectsLoading(false);
        }
    }, [user]);

    // Load profile data from Firestore
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const getProfile = async ()=> {
            try {
                // Set doc title to users to match the back end
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile({
                        name: data.name || "",
                        bio: data.bio || "",
                        pfpUrl: data.pfpUrl || "",
                        title: data.title || "",
                        contact: data.contact || "",
                        location: data.location || "",
                    });
                    // Load tags from Firestore
                    setTags(data.tags || []);
                    // Check for a conneted git account
                    setIsGitHubConnected(!!data.githubInstallationId);
                
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        getProfile();
        loadProjects();
    },[user, loadProjects]);

    // Save date to firestore
    const save = async () => { 
        if (!user) {
            alert("Please log in first");
            return;
        }

        try {
            // Save profile with tags immediately
            await setDoc(doc(db, "users", user.uid), {
                ...profile,
                tags
            });
            alert("Profile saved successfully");
        } catch (err) {
            alert("Failed to save profile");
        }

        // Handle profile picture upload separately
        let pfpUrl = profile.pfpUrl;
        try {
            if (pfpFile) {
                const storage = getStorage();
                const pfpRef = ref(storage, 'pfpImages/$(user.uid).jpg');
                await uploadBytes(pfpRef, pfpFile);
                pfpUrl = await getDownloadURL(pfpRef);

                // Update profile with new profile picture URL
                await setDoc(doc(db, "users", user.uid), {
                    ...profile,
                    pfpUrl,
                    tags
                });

                setProfile((prev) =>({...prev, pfpUrl}));
                alert("Profile saved successfully");
            }
        }
        catch (err){
            console.error(err);
            alert("Failed to save profile");
        }
    } 

    // Handle project click - open in projectview
    const handleProjectClick = (project: Project) => {
        setSelectedProject({ id: project.id, userId: project.userId });
    };

    if (!user) return <p>Please log in to view profile</p>;
    if (loading) return <p>Loading profile</p>;
    /*  Simple profile text field editing, should be updated with
        implementation of full page
     */
    return ( 
        <div
            style={{
                display: "flex",
                minHeight: "100%",
                fontFamily: "sans-serif"
            }}
        >
            {/* Left Section - Existing Profile Edit Form */}
            <div
                style={{
                    flex: 1,
                    padding: "2rem",
                    overflowY: "auto"
                }}
            >
         <h2>Edit Profile</h2>   
            <div
                style={{
                    width: "500px",
                    border: "4px solid #a9e",
                    padding : "1.5rem",
                    borderRadius: '5px',
                    background:"white",
                    marginTop:"6rem",
                    position: "relative"
                }}
            >
            <div style ={{display: "flex", justifyContent:"space-between"}}>
                
                <div 
                    style={{position:"absolute",top:"-90px",left:"10px"}}>
                    
                    {profile.pfpUrl ? (
                        <img 
                            src={profile.pfpUrl} 
                            alt="profile"
                            style={{
                                width:150,
                                height:150,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "4px solid #ddd"
                            }}
                        />
                    ) : (<div
                            style ={{
                                width:150,
                                height:150,
                                borderRadius: "50%",
                                background: "#eee",
                               
                                border: "5px solid #ddd",
                                display:"flex",
                                alignItems: "center",
                                justifyContent: "center"
                
                            }}
                        >
                            <strong>No PFP provided</strong>
                        </div>
                    )}
                </div>
                    {/* upload/change pfp */}
                    <div style={{marginLeft:"170px"}}>
                        <strong>Set Profile Picture:</strong>
                        <input
                            type="file"
                            accept="image/*"
                            
                            onChange={(x) => {
                                const file = x.target.files?.[0];

                                if (!file) {
                                    return;
                                }
                                if (file.type === 'image/gif'){
                                    alert("GIFs are not allowed");
                                    x.target.value = "";
                                    return;
                                }
                                if (x.target.files && x.target.files[0]) {
                                    

                                    setPfpFile(file);

                                    const localUrl = URL.createObjectURL(file);
                                    setProfile((prev => ({...prev, pfpUrl: localUrl})));
                                }
                            }}
                        />
                    </div>
                
                
            
            </div>
            {/* name, title, location */}
            <div style={{ marginTop: "1rem"}}>
               
                <label style={{display:"block",marginBottom:"0.2rem",alignItems:"center"}}>
                    <strong>Name:</strong>
                    <input
                        type="text"
                        maxLength={50}
                        style={{
                            width:"100%",
                            border: "2px solid #ddd",
                            borderRadius: "4px"
                        }}
                        value={profile.name}
                        onChange={(x) => setProfile({ ...profile, name: x.target.value })}
                    />
                    
                </label>
            </div>
            <div style={{ marginTop: "0.2rem"}}>
               
                <label style={{display:"block",marginBottom:"0.2rem",alignItems:"center"}}>
                    <strong>Title:</strong>
                    <input
                        type="text"
                        maxLength={50}
                        style={{
                            width:"100%",
                            border: "2px solid #ddd",
                            borderRadius: "4px"
                        }}
                        value={profile.title}
                        onChange={(x) => setProfile({ ...profile, title: x.target.value })}
                    />
                    
                </label>

                <label style={{display:"block",marginBottom:"0.2rem",alignItems:"center"}}>
                    <strong>Location:</strong>
                    <input
                        type="text"
                        maxLength={50}
                        style={{
                            width:"100%",
                            border: "2px solid #ddd",
                            borderRadius: "4px"
                        }}
                        value={profile.location}
                        onChange={(x) => setProfile({ ...profile, location: x.target.value })}
                    />
                    
                </label>
                <label style={{display:"block",marginBottom:"0.2rem",alignItems:"center"}}>
                    <strong>Contact:</strong>
                    <input
                        type="text"
                        maxLength={50}
                        style={{
                            width:"100%",
                            border: "2px solid #ddd",
                            borderRadius: "4px"
                        }}
                        value={profile.contact}
                        onChange={(x) => setProfile({ ...profile, contact: x.target.value })}
                    />
                    
                </label>
            </div>
            
            <div style={{ marginTop: "1rem"}}>
               
                <label style={{marginBottom:"0.2rem",alignItems:"center"}}>
                    <strong>Bio:</strong>
                    <textarea
                        maxLength={500}
                        style={{
                            width:"100%",
                            minHeight:"100px",
                            border: "2px solid #ddd",
                            borderRadius: "4px",
                            resize: "vertical",
                            overflowWrap: "break-word",
                            
                        }}
                        value={profile.bio}
                        onChange={(x) => setProfile({ ...profile, bio: x.target.value })}
                    />
                    
                </label>
            </div>

            {/* Tags section */}
            <div style={{ marginTop: "1rem"}}>
                <label style={{display:"block",marginBottom:"0.5rem"}}>
                    <strong>Tags:</strong>
                </label>
                <TagSelector tags={tags} setTags={setTags} />
            </div>
            
            <button
                    onClick={save}
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: "#a9e",
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Save Profile
                </button>

            <div style={{padding: "1rem",
                    marginTop: "2rem",
                    borderTop: "3px solid #fa7d35ff",
                    }}>
                    
                    {isGitHubConnected ? (
                        <DisconnectGitHub />
                    ) : (
                        <ConnectGitHub />
                    )}
            </div>
             <DisplayRepos />
            </div>
            <div>
                <UploadResume />
            </div>
            </div>

            {/* Right Section with Name and Projects */}
            <div
                style={{
                    flex: 1,
                    padding: "4rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    minHeight: "100%",
                   
                }}
            >
                {/* User Name */}
                <h1
                    style={{
                        color: "#333",
                        fontSize: "24px",
                        fontWeight: "bold",

                        marginTop: "3rem",
                        textAlign: "left"
                    }}
                >
                    
                </h1>
                <h2
                        style={{
                            color: "#333",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "0rem",
                            textAlign: "left"
                        }}
                    >
                        {profile.name || user?.displayName || user?.email || "User"}'s Portfolio:
                    </h2>
                {/* Orange Box with Projects */}
                <div
                    style={{
                        border: "4px solid #fa7d35",
                        backgroundColor: "transparent",
                        width: "100%",
                        padding: "1.5rem",
                        borderRadius: "6px",
                        minHeight: "400px",
                        maxHeight: "685px",
                        overflowY: "auto",
                        marginTop: "0rem"
                    }}
                >
                    
                    {projectsLoading ? (
                        <p style={{ color: "#666", textAlign: "center" }}>Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <p style={{ color: "#666", textAlign: "center" }}>No projects yet</p>
                    ) : (
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "0.75rem"
                        }}>
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => handleProjectClick(project)}
                                    style={{
                                        backgroundColor: "#FFDAB3",
                                        padding: "1rem",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        border: "2px solid transparent",
                                        transition: "all 0.2s ease",
                                        minHeight: "100px"
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
                                        {project.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            lineHeight: "1.4",
                                            marginBottom: "0.5rem"
                                        }}
                                    >
                                        {project.desc.length > 60
                                            ? project.desc.substring(0, 60) + "..."
                                            : project.desc || "No description"}
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "0.3rem",
                                                marginTop: "0.5rem"
                                            }}
                                        >
                                            {project.tags.slice(0, 3).map((tag: string, index: number) => (
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
                                            {project.tags.length > 3 && (
                                                <span
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "#666",
                                                        alignSelf: "center",
                                                        marginLeft: "0.2rem"
                                                    }}
                                                >
                                                    +{project.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProject && (
                <ProjectView
                    projectId={selectedProject.id}
                    userId={selectedProject.userId}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}
