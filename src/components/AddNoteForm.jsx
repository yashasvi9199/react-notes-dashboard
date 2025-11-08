import React, {useState, useEffect} from "react";

export default function AddNoteForm ({onAdd, editing, onCancel, onSave}) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    // If we are editing, populate the form with existing data
    useEffect( ()=> {
     if (editing){
        setTitle(editing.title || "");
        setContent(editing.content || "");
     }else {
        setTitle("");
        setContent("");
     }
    }, [editing]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        // Don't add empty notes
        if (!trimmedTitle && !trimmedContent) return;

        if (editing) {
            onSave({ ...editing, title: trimmedTitle, content: trimmedContent });
        } else {
            onAdd({ title: trimmedTitle || "Untitled", content: trimmedContent });
            setTitle("");
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 rounder border outline-none"
            />

            <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 rounded border outline-none resize-y min-h-[80px]"
            />

            <div className="flex gap-2">
                <button className="px-4 py-2 rounded border" type="submit">
                    {editing ? "Save" : "Add"}
                </button>
                {editing && (
                    <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded border"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}