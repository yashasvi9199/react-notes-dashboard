import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";
import { fetchNotes, createNote, updateNote, deleteNote } from "./services/notesApi";

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
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Load notes from API from component mount
  useEffect( () => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try{
      setLoading(true);
      const notesData = await fetchNotes();
      setNotes(notesData);
    }catch(err){
      console.error('Failed to load notes: ',err);
      alert('Failed to load notes. Please check if backened is running.');
    }finally{
      setLoading(false);
    }
  }

  /* // Add a note (prepends to list)
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
  }; */


  //* Add note via API
  const addNote = async (notesData) => {
    try{
      await createNote(notesData);
      await loadNotes();
    }catch(err){
      console.error('Failed to create note: ',err);
      alert('Failed to create note.')
    }
  };

  //* Delete Note via API
  const deleteNoteHandler = async (id) => {
    try{
      await deleteNote(id);
      await loadNotes();
      if(editing && editing.id === id) setEditing(null);
    }catch(err){
      console.error('Failed to delete note');
      alert("Failed to delete note.");
    }
  };

  //* Save edited note via API
  const saveEdit = async (updated) => {
    try{
      await updateNote(updateNote.id, updated);
      await loadNotes();
      setEditing(null);
    }catch(err){
      console.error("Failed to update note: ",err);
      alert("Failed to update note.")
    }
  };

  const cancelEdit = () => setEditing(null);
  const startEdit = (note) => setEditing(note);

  // Simple search/filter
  const filtered = useMemo( () => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter( (n) => 
      (n.title + " " + n.content).toLowerCase().includes(q)
    );
  }, [notes, query])

  // Fix the search input handler
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  }

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
            onChange={handleSearchChange}
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
                    onDelete={deleteNoteHandler}
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