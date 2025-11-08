import React, { useState } from "react";
import AddNoteForm from "./components/AddNoteForm";

export default function TestAddNote() {
    const [notes, setNotes] = useState([]);
    const [editing,setEditing] = useState(null)

    function handleAdd(note){
        const newNote = {
            id: Date.now().toString(),
            title: note.title,
            content: note.content,
            createdAt: Date.now()
        };

        setNotes(prev => [newNote, ...prev]);   // prev is short for previous array before adding. By [newNote, ...prev] we are combining newnote and prev note. <...> is called spread operator
        console.log("Added: ",newNote)
    }

    function handleSave(updatedNote) {
        setNotes(prev => prev.map(n => (n.id === updatedNote.id ? updatedNote : n)));
        setEditing(null);   // exit editing mode after save
        console.log("Saved: ",updatedNote);
    }

    function handleCancel() {
        setEditing(null);
    }

    function startEdit(note) {
        setEditing(note);
    }

    function handleDelete(id) {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (editing && editing.id === id) setEditing(null);
    }

    return (
        <div style={{ padding: "20 px"}}>
            <h2>Notes (count: {notes.length}) </h2>

            <AddNoteForm
                onAdd={handleAdd}
                editing={editing}
                onCancel={handleCancel}
                onSave={handleSave}
            />

            <hr />

            <ul>
                {notes.map(n => (
                    <li key={n.id} style={{ margin: "8px 0"}}>
                        <strong>{n.title}</strong>
                        <div>{n.content}</div>
                        <button onClick={ () => startEdit(n)}>Edit</button>
                        <button onClick={ () => handleDelete(n.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}