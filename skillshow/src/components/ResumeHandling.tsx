// 

// Cannot currently use firebase storage, so this is entirely clientside for now.

//

// Step 1: Make an input that can accept a file {CHECK}
// Step 2: Make a firebase connection to store that file
// Step 3: Download the file from the website

import React, { useState } from "react";
import { Form } from "react-bootstrap";


// import {db} from '../firebase-config'
// import { getStorage, ref, uploadBytes } from 'firebase/storage';


export function UploadResume(): React.JSX.Element {    
    // I think we might need to upgrade our firebase plan to use their storage components
    // So I'll set it up locally instead for now.

    const [file, setFile] = useState<File | null>(null);
    
    function updateFile(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files && event.target.files[0]){
            setFile(event.target.files[0]);
        }
    }

    function downloadFile(){
        if (!file) return;

        // Make a download link
        const url = URL.createObjectURL(file);
        const link = document.createElement('a')
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }


    return (
        // From textbook "Saving and Loading"
        <div>
            <pre style={ { overflow: "scroll", height: "100px" } }>Resume: {file?.name}</pre>
            <Form.Group controlId="resumeForm">
                <Form.Label>Upload your resume </Form.Label>
                <Form.Control type="file" onChange={updateFile} />
            </Form.Group>

            {file != null ? (
                <button onClick={downloadFile}>Download File</button>)
            : <div>No File Uploaded</div>}
        </div>
    )
}
