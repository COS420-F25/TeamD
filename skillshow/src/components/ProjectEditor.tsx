import React, {useEffect, useState} from "react";
import {db} from "../firebase-config";
import {User} from "firebase/auth";
import { doc, setDoc} from "firebase/firestore";
import { Project } from "../types/Project";
import { TagSelector } from "./Tags";


interface ProjectEditorProps{
    user: User;
    project: Project;
    refresh: ()=>Promise<any>;
    onClose: ()=>void;
}


export function ProjectEditor({user, project,onClose,refresh}: ProjectEditorProps){
    const [data, setData] = useState(project);
    const [newField, setNewField] = useState("");
    const [saving, setSaving] = useState(false);
    

    useEffect(()=>{
        setData(normalize(project))
    }, [project]);

    const normalize = (p: Project): Project => ({
        id: p.id,
        title: p.title ?? "",
        desc: p.desc ?? "",
        tags: p.tags ?? [],
        fields: p.fields ?? [],
        userId: p.userId,
        createdAt: p.createdAt
    });


    const save = async () => {

            if (!user) {
                alert("Please log in first");
                return;
            }
            setSaving(true);
            const ref = doc(db, "users", user.uid, "projects", project.id);
            try {
                setDoc(ref, data);
                await refresh();
                onClose();
                
                alert("Project saved successfully");
            } catch (err) {
                alert("Failed to save project");
                console.error(err);
            } finally {
                setSaving(false);
            }
            
        } 

    //tagging stuff, should probably be updated to integrate with tagging system once that is completed
    const updateTags = (tags: string[]) => {
        setData({ ...data, tags });
    };

    //field stuff, for adding and removing text fields from a project
    const addField = () => {
         if (!newField.trim()){
            return;}
        const id = crypto.randomUUID();
        setData({...data,fields:[...data.fields,{id, label: newField, value: ""}]});
        setNewField("");
    };

    const updateField = (id:string,value:string) => {
        setData({
            ...data,fields:data.fields.map((x:any)=>x.id===id ? { ...x, value, label: x.label ?? "" }:x),
        });
    };

    const removeField = (id:string) => {
        setData({...data,fields: data.fields.filter((f:any)=> f.id !== id)});
    };

    return(
        <div>
            <h2>Edit Project</h2>
           
            <div>
                <label>Title:</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(x)=> setData({...data,title:x.target.value})}
                    />
            </div>
            <div>
                <label>Description:</label>
                    <textarea
                        value={data.desc}
                        onChange={(x)=> setData({...data,desc:x.target.value})}
                    />
            </div>
        
            <div>
               <div className="section">
                    <h3>Insert Tags</h3>
                    <TagSelector tags={data.tags} setTags={updateTags} />
                </div>
            </div>

            <div>
                <label>Add Text Field:</label>
                <input
                    type="text"
                    value={newField}
                    onChange={(x)=> setNewField(x.target.value)}
                />
                <button onClick={addField}>Add</button>
                {data.fields.map((field:any)=>(
                    <div key={field.id}>
                        <label>{field.label}:</label>
                        <input
                            type="text"
                            value={field.value}
                            onChange={(x)=> updateField(field.id,x.target.value)}/>
                        <button onClick = {()=>removeField(field.id)}>Remove</button>
                    </div>
                ))}
                
            </div>
            <div>
                <div>
                    <button onClick={save} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose} disabled={saving}>Close</button>
                </div>
            </div>
        </div>
    );


}