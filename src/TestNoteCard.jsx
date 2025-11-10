import React from "react";
import NoteCard from "./components/NoteCard";

export default function TestNoteCard() {
    const dummyNote = {
        id: 1,
        title: "React Project",
        content: "Learned project creation from scratch with tailwindcss and more",
        createdAt: Date.now(),
    };

    const handleEdit = (note) => console.log("Edit clicked: ", note);
    const handleDelete = (id) => console.log("Delete Clicked: ",id);

    return(
        <div className="p-6">
            <h2 className="text-x1 font-bold mb-4">Test NoteCard</h2>
            <NoteCard note={dummyNote} onEdit={handleEdit} onDelete={handleDelete} />
            {/* // temporary test in a component or main.jsx render */}
<button className="px-4 py-2 border rounded hover:bg-blue-200">Hover me</button>

        </div>
    );
}