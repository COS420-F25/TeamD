import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { GitHubRepoService, Repository } from '../services/GitHubRepoService';
import { ConnectGitHub } from './ConnectGitHub';


const debug = 0;

export function DisplayRepos(){

    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState("");

    const GitHubService = new GitHubRepoService();

    const loadRepos = async () => {

        setLoading(true);
        setError("");

        try{

            const userID = auth.currentUser?.uid;
            if(!userID){

                setError('Please log in first');
                setLoading(false);
                return;
            }
            
            // Get the installattion ID for the user to display repo
            const userDoc = await getDoc(doc(db,'users', userID));
            const userData = userDoc.data();
            if(debug){
                console.log(userData);
            }

            const installationID = userData?.installationId;
            if(!installationID){
                setIsConnected(false);
                setLoading(false);
                setError("Error getting installation ID")
                return;
            }

            setIsConnected(true);
        }
        catch(err){
             console.error("Error loading repositories:", err);
        }
        


    }



        if (loading){
            return <div>Loading repositories...</div>
        }

        if (!isConnected){

            return <div><span>GitHub not connected</span></div>
        }


}