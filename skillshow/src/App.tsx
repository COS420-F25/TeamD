import React from 'react';
import './App.css';

import {auth} from "./firebase-config";
import {collection} from "firebase/firestore"
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";

import AddToDBButton from "./components/AddtoDBButton";

function App() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <div className="App">
      Hello World
      <div>
        <button onClick={() => signInWithGoogle()}>Sign In</button>
        {(user)?<div>{user.user.displayName}</div>:<div>Not logged in</div>}
      </div>
      <hr/>
      <AddToDBButton />
    </div>
  );
}

export default App;
