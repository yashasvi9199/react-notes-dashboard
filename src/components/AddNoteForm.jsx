import React, { useState, useEffect } from "react";
import CategorySelector from "./CategorySelector";

export default function AddNoteForm({ onAdd, editing, onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setContent(editing.content || "");
      setCategory(editing.category || "General");
    } else {
      setTitle("");
      setContent("");
      setCategory("General");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;
    
    const noteData = { 
      title: t || "Untitled", 
      content: c, 
      category: category 
    };
    
    if (editing) {
      onSave && onSave({ ...editing, ...noteData });
    } else {
      onAdd && onAdd(noteData);
      setTitle("");
      setContent("");
      setCategory("General");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }} className="panel-title">Title</label>
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Title"
      />

      <label style={{ display: "block", margin: "10px 0 8px", fontWeight: 700 }} className="panel-title">Note</label>
      <textarea
        className="form-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        aria-label="Note content"
      />

      <div style={{ margin: "10px 0" }}>
        <CategorySelector 
          selectedCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
        <button type="submit" className="btn-add">
          {editing ? "Save" : "Add"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="btn-inline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}