import React, {useEffect, useState} from "react";
import {db} from "../firebase-config";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {User} from "firebase/auth";
import { DisplayRepos } from "../components/DisplayRepos";
import { ConnectGitHub, DisconnectGitHub } from "../components/ConnectGitHub"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { UploadResume } from "../components/ResumeHandling"
import { TagSelector } from "../components/Tags"

interface ProfilePageProps{
    user: User | null;
}

export function ProfilePage({user}:ProfilePageProps): React.JSX.Element {
    const [profile, setProfile] = useState({ name: "", bio: "" , pfpUrl: "", title: "", contact:"", location:""});
    const [tags, setTags] = useState<string[]>([]);
    const [pfpFile, setPfpFile] = useState<File | null> (null); 
    const [loading, setLoading] = useState(true);
    const [isGitHubConnected, setIsGitHubConnected] = useState(false);
   

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
    },[user]);

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

    if (!user) return <p>Please log in to view profile</p>;
    if (loading) return <p>Loading profile</p>;
    /*  Simple profile text field editing, should be updated with
        implementation of full page
     */
    return ( 
        <div
            style={{
                padding: "2rem",
                fontFamily: "sans-serif"
            }}
        >
         <h2>Edit Profile</h2>
         <div style={{ display: "flex", gap: "2rem" }}>
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
        
        <div style={{   
            flex: 1,
            border: "4px solid #ffa876ff",
            padding: "0 1.5rem 1.5rem 1.5rem",
            borderRadius: "5px",
            background: "white",
            marginTop: "6rem"
        }}>
            <UploadResume />
        </div>
        </div>
        </div>
    );
}