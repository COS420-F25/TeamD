import React, {useEffect, useState} from "react";
import {db} from "../firebase-config";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {User} from "firebase/auth";

interface ProfilePageProps{
    user: User | null;
}


export function ProfilePage({user}:ProfilePageProps): React.JSX.Element {
    const [profile, setProfile] = useState({ name: "", bio: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {// Load profile data from Firestore
        if (!user) {
            setLoading(false);
            return;
        }
        const getProfile = async ()=> {
            try {
                const docRef = doc(db, "profiles", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile({
                        name: data.name || "",
                        bio: data.bio || ""
                    })
                
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    },[user]);

    const save = async () => { //save date to firestore
        if (!user) {
            alert("Please log in first");
            return;
        }

        try {
            await setDoc(doc(db, "profiles", user.uid), profile);
            alert("Profile saved successfully");
        } catch (err) {
            alert("Failed to save profile");
        }
    };

    if (!user) return <p>Please log in to view profile</p>;
    if (loading) return <p>Loading profile</p>;

    return ( //simple profile text field editing, should be updated with implementation of full page
        <div>
        <h2>Temp Profile</h2>
        <div>
            <label>
            Name:
            <input
                type="text"
                value={profile.name}
                onChange={(x) => setProfile({ ...profile, name: x.target.value })}
            />
            </label>
        </div>
        <div>
            <label>
            Bio:
            <textarea
                value={profile.bio}
                onChange={(y) => setProfile({ ...profile, bio: y.target.value })}
            ></textarea>
            </label>
        </div>
        <button onClick={save}>Save Profile</button>
        </div>
    );
}
