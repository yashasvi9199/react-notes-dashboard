// src/components/NoteCard.jsx
import React from "react";

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
        <h3 className="title">{note.title}</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onEdit(note)} className="btn-inline" aria-label="Edit note">
            Edit
          </button>
          <button onClick={() => onDelete(note.id)} className="btn-inline" aria-label="Delete note" style={{ color: "var(--danger)" }}>
            Delete
          </button>
        </div>
      </div>

      <p className="content">{note.content}</p>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span className="meta" style={{ 
          padding: "2px 8px", 
          backgroundColor: "#f3f4f6", 
          borderRadius: "4px",
          fontSize: "12px"
        }}>
          {note.category}
        </span>
        <div className="meta">{new Date(note.createdAt).toLocaleString()}</div>
      </div>
    </article>
  );
}