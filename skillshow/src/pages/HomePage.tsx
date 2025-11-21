import React from "react"
import AddToDBButton from "../components/AddtoDBButton"
import { ConnectGitHub, DisconnectGitHub } from "../components/ConnectGitHub"
import { ProfilePage } from "./ProfilePage"
import { User } from "firebase/auth"

interface HomepageProps {
    user: User | null;
    signInWithGoogle: () => void;
}


export function Homepage({user, signInWithGoogle}: HomepageProps){
    
    return(
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
            {(user)?<div>{user.displayName}</div>:<div>Not logged in</div>}
          </div>
          <hr/>
          <AddToDBButton />
          {user &&<ProfilePage user={user} />}
          <ConnectGitHub />
          
          <DisconnectGitHub/>
        </div>
      </div>
      
    </div>
    
  );

}
