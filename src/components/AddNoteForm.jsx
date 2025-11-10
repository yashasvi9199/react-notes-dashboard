// src/components/AddNoteForm.jsx
import React, { useState, useEffect } from "react";

export default function AddNoteForm({ onAdd, editing, onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setContent(editing.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;
    
    const noteData = { title: t || "Untitled", content: c, category: "General" };
    console.log('Submitting note data:', noteData); // Debug log
    
    if (editing) {
      onSave && onSave({ ...editing, ...noteData });
    } else {
      onAdd && onAdd(noteData);
      setTitle("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Title</label>
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Title"
      />

      <label style={{ display: "block", margin: "10px 0 8px", fontWeight: 700 }}>Note</label>
      <textarea
        className="form-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        aria-label="Note content"
      />

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
        <button type="submit" className="btn-add">
          {editing ? "Save" : "Add"}
        </button>
        {editing && (
          <button style={{color: 'var(--danger)'}}type="button" onClick={onCancel} className="btn-inline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
