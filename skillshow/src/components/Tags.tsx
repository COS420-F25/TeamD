import React, {useState} from "react";

export const AVAILABLE_TAGS = [
  "React",
  "Node.js",
  "Firebase",
  "UI/UX",
  "TypeScript",
  "Python",
  "Machine Learning",
  "CSS",
  "HTML"
];

interface TagSelectorProps{
    tags: string[]
    setTags: (tags: string[]) => void
}

export function TagSelector({tags, setTags}: TagSelectorProps) {
    const [selectedTag, setSelectedTag] = useState("")

    const addTag = () => {
        if (!selectedTag||tags.includes(selectedTag)) return;
        setTags([...tags, selectedTag]);
        setSelectedTag("");
    }

    const removeTag = (tagtoRemove: string) =>{
        setTags(tags.filter(t => t !== tagtoRemove))
    }

    return (
        <div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: 8}}>
                {tags.map(tag => (
                    <div
                    key={tag}
                    onClick={() => removeTag(tag)}
                    style={{
                        padding: "6px 10px",
                        background: "#ddd",
                        borderRadius: "12px",
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                    >
                    {tag} X
                    </div>
                ))}
            </div>

            {/* Dropdown to select tags*/}
            <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={{padding: 6, marginRight: 8}}
            >
                <option value="">-- Select a tag --</option>
                {AVAILABLE_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>

            <button onClick={addTag}>Add Tag</button>
        </div>
    )
}