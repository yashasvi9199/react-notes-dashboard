import React from "react";

export default function NoteCard({ note, onEdit, onDelete }) {
  // Fix date display - use createdAt from database
  const displayDate = note.created_at ? new Date(note.created_at) : new Date(note.createdAt);
  
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
        <span className="category-badge">
          {note.category}
        </span>
        <div className="meta">
          {displayDate.toLocaleDateString()} {displayDate.toLocaleTimeString()}
        </div>
      </div>
    </article>
  );
}