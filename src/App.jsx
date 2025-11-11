import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";
import { fetchNotes, createNote, updateNote, deleteNote, searchNotes } from "./services/notesApi";

function AppInner(){
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Load notes from API on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesData = await fetchNotes();
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load notes:', error);
      alert('Failed to load notes. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      await loadNotes();
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await searchNotes(searchQuery);
      setNotes(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to client-side filtering if search API fails
      await loadNotes();
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Add a note via API
  const addNote = async (noteData) => {
    try {
      await createNote(noteData);
      await loadNotes();
      setQuery(""); // Clear search after adding new note
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note.');
    }
  };

  // Delete note via API
  const deleteNoteHandler = async (id) => {
    try {
      await deleteNote(id);
      await loadNotes();
      if (editing && editing.id === id) setEditing(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note.');
    }
  };

  // Save edited note via API
  const saveEdit = async (updated) => {
    try {
      const updateData = {
        title: updated.title,
        content: updated.content,
        category: updated.category
      };
      
      await updateNote(updated.id, updateData);
      await loadNotes();
      setEditing(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert(`Failed to update note: ${error.message}`);
    }
  };

  const cancelEdit = () => setEditing(null);
  const startEdit = (note) => setEditing(note);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return(
    <div className={`app-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Notes Dashboard</h1>
          <p className="app-sub">A compact Notes app - practice React fundamentals.</p>
        </div>

        <div className="header-right">
          <div style={{ position: 'relative' }}>
            <input
              className="search-input"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              aria-label="Search notes"
            />
            {searching && (
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                Searching...
              </div>
            )}
          </div>
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
            <div>Searching: <strong>{query ? `"${query}"` : 'No'}</strong></div>
            <div className="tip">Tip: Search queries the database directly</div>
          </div>
        </aside>

        <section className="panel panel-list">
          {loading ? (
            <div className="empty">Loading notes...</div>
          ) : searching ? (
            <div className="empty">Searching...</div>
          ) : notes.length === 0 ? (
            <div className="empty">
              {query ? `No notes found for "${query}"` : 'No notes found - add your first one!'}
            </div>
          ) : (
            <div className="grid">
              {notes.map((note) => (
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
  );
}