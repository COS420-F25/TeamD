import React, {useState} from 'react';
import './App.css';

import {auth} from "./firebase-config";
import { User } from "firebase/auth";
// import {collection} from "firebase/firestore"
import {useSignInWithGoogle, useAuthState} from "react-firebase-hooks/auth";
// import {useCollection} from "react-firebase-hooks/firestore";

//Pages imports 
import { Homepage } from "./pages/HomePage"
// move this page to pages folder later
import { ProfilePage } from './pages/ProfilePage';
import { ProjectEditPage } from "./pages/ProjectEditPage"
import { SearchPage } from "./pages/SearchPage"


function App() {
const [signInWithGoogle] = useSignInWithGoogle(auth);
const [userRaw] = useAuthState(auth);

const user: User | null = userRaw ?? null;

  //page state, homepage by default
  const [page, setPage] = useState("home");

  // navigation bar
  const NavBar = () => (
    <div>
      {/* Main purple navigation bar Started with cursor and updated with CSS styling*/}
      <div className="nav-main-bar">
        <div className="nav-logo">SkillShow</div>
        <div className="nav-links">
          <button 
            className={`nav-link ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button 
            className={`nav-link ${page === "profile" ? "active" : ""}`}
            onClick={() => setPage("profile")}
          >
            Profile
          </button>
          <button 
            className={`nav-link ${page === "projects" ? "active" : ""}`}
            onClick={() => setPage("projects")}
          >
            Projects
          </button>
          <button 
            className={`nav-link ${page === "search" ? "active" : ""}`}
            onClick={() => setPage("search")}
          >
            Search
          </button>
        </div>
        <div className="nav-color-bars">
          <div className="nav-color-bar bar-green"></div>
          <div className="nav-color-bar bar-yellow"></div>
          <div className="nav-color-bar bar-red"></div>
        </div>
      </div>
      
      {/* Orange bar below navigation */}
      <div className="nav-orange-bar"></div>
    </div>
  )

  // page renderer for different page views
  const renderPage = () => {
    switch (page) {
      case "home":
        return <Homepage user={user} signInWithGoogle={signInWithGoogle} />
      case "profile":
        return <ProfilePage user={user}/>
      case "projects":
        return <ProjectEditPage user={user}/>
      case "search":
        return <SearchPage user={user}/>
      default:
        return <Homepage user={user} signInWithGoogle={signInWithGoogle} />
    }
  }
  
  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {renderPage()}
      </div>
    </div>
  )
}

export default App;