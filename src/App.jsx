import React, { useMemo, useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";

/**
 * AppInner - the main UI and logic for notes
 * 
 * manages notes state (persistent via useLocalStorage)
 * handles add, edit, delete flows
 * has a simple search filter
 * uses ThemeContext to read theme and toggle
 */
function AppInner(){
  const [notes, setNotes] = useLocalStorage("rn_notes", []);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Add a note (prepends to list)
  const addNote = ({ title, content }) => {
    const newNote = {
      id: Date.now().toString(),
      title: title || "Untitled",
      content: content || "",
      createdAt: Date.now(),
    };
    setNotes( (prev) => [newNote, ...prev]);
  };

  // Delete by id
  const deleteNote = (id) => {
    setNotes( (prev) => prev.filter( (n) => n.id !== id));
    if (editing && editing.id === id) setEditing(null);
  };

  // Start editing note (event)
  const startEdit = (note) => setEditing(note);

  // Save edited note (replace in array)
  const saveEdit = (updated) => {
    setNotes( (prev) => prev.map( (n) => (n.id === updated.id ? updated : n )));
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  // Simple search/filter
  const filtered = useMemo( () => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter( (n)=> (n.title + " " + n.content).toLowerCase().includes(q));
  }, [notes, query])

  return(
    <div className={`app-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Notes Dashboard</h1>
          <p className="app-sub">A compact Notes add - practice React fundamentals.</p>
        </div>

        <div className="header-right">
          <input
            className="search-input"
            value={query}
            onChange={ (e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
          />
          <button
            className="btn small"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="panel panel-left">
          <h2 className="panel-title">Create / Edit</h2>
          <AddNoteForm 
            onAdd={addNote}
            editing={editing}
            onCancel={cancelEdit}
            onSave={saveEdit}
          />

          <div className="meta">
            <div>Total notes: <strong>{notes.length}</strong></div>
            <div className="tip">Tip: try editing a note, search and toggle theme</div>
          </div>
        </aside>

        <section className="panel panel-list">
          {/* terniary operator being used with "?" and ":" 
          to check if there are any notes or not in panel*/}
          {filtered.length === 0 ? (
            <div className="empty">No notes found - add your first one!</div>
            ) : (
              <div className="grid">
                {filtered.map( (note)=> (
                  <NoteCard 
                    key={note.id}
                    note={note}
                    onEdit={startEdit}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            )}
        </section>
      </main>

      <footer className="app-footer">
        Built for quick revision • Practice hooks, state, context and effects
      </footer>

    </div>
  );
}

export default function App(){
  return(
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}