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
import { ProfilePage } from './components/ProfilePage';
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
    <nav style={{padding: 10, background: "#f0f0f0", marginBottom: 20}}>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("profile")}>Profile</button>
      <button onClick={() => setPage("projects")}>Projects</button>
      <button onClick={() => setPage("search")}>Search</button>
    </nav>
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
    <div>
      <NavBar />
      {renderPage()}
    </div>
    
  )
}

export default App;
