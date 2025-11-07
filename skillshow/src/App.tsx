import React from 'react';
import './App.css';

import {auth} from "./firebase-config";
import {collection} from "firebase/firestore"
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";

import AddToDBButton from "./components/AddtoDBButton";
import { ConnectGitHub, DisconnectGitHub } from './components/ConnectGitHub';

function App() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    
    <div className="home-container">

      <div className="left-panel">
        <h1 className="logo-text">SkillShow</h1>
        <div className="color-bars">
          <div className="bar bar-green"></div>
          <div className="bar bar-yellow"></div>
          <div className="bar bar-red"></div>
          
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h2 className="login-title">Login/Sign-Up</h2>
          <p className="login-role">As Employer<br />Or<br />Job Seeker</p>
          <div>
            <button onClick={() => signInWithGoogle()}>Sign In</button>
            {(user)?<div>{user.user.displayName}</div>:<div>Not logged in</div>}
          </div>
          <hr/>
          <AddToDBButton />
          <ConnectGitHub />
          
          <DisconnectGitHub/>
        </div>
      </div>
      
    </div>
  );
}

export default App;
