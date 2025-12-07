import React from 'react';

import {db} from '../firebase-config'
import {collection, addDoc} from 'firebase/firestore';

function AddToDBButton(){

    return (
    <button onClick={() => {
        addDoc(collection(db, "user"), {
            first: "Xander",
            last: "Watkins"
        });
    }}>Add to DB</button>
    );
}

export default AddToDBButton