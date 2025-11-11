import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";
import CategoryFilter from "./components/CategoryFilter";
import StatsDashboard from "./components/StatsDashboard";
import ScrollToTop from "./components/ScrollToTop";
import { fetchNotes, createNote, updateNote, deleteNote, searchNotes, getNotesByCategory } from "./services/notesApi";

// Import the new organized CSS
import "./styles/styles.css";
import "./styles/components.css";

function AppInner(){
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Load notes from API on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async (category = "") => {
    try {
      setLoading(true);
      let notesData;
      
      if (category) {
        notesData = await getNotesByCategory(category);
      } else {
        notesData = await fetchNotes();
      }
      
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load notes:', error);
      alert('Failed to load notes. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter change
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setQuery(""); // Clear search when changing category
    await loadNotes(category);
  };

  // Calculate note counts per category
  const noteCounts = React.useMemo(() => {
    const counts = {};
    notes.forEach(note => {
      counts[note.category] = (counts[note.category] || 0) + 1;
    });
    return counts;
  }, [notes]);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      await loadNotes(selectedCategory);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await searchNotes(searchQuery);
      setNotes(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      await loadNotes(selectedCategory);
    } finally {
      setSearching(false);
    }
  }, [selectedCategory]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Add a note via API
  const addNote = async (noteData) => {
    try {
      await createNote(noteData);
      await loadNotes(selectedCategory);
      setQuery("");
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note.');
    }
  };

  // Delete note via API
  const deleteNoteHandler = async (id) => {
    try {
      await deleteNote(id);
      await loadNotes(selectedCategory);
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
      await loadNotes(selectedCategory);
      setEditing(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert(`Failed to update note: ${error.message}`);
    }
  };

  const cancelEdit = () => setEditing(null);

  // Start edit with auto-scroll to top
  const startEdit = (note) => {
    setEditing(note);
    // Auto-scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return(
    <div className={`app-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* App Header with Title */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Notes Dashboard</h1>
          <p className="app-sub">A compact Notes app - practice React fundamentals.</p>
        </div>
      </header>

      {/* Sticky Filter Bar with Categories, Search and Theme Toggle */}
      <section className="filter-bar">
        <div className="filter-bar-content">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            noteCounts={noteCounts}
          />
          
          <div className="search-theme-container">
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
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area with Three Panels */}
      <main className="app-main">
        {/* Left Panel - Create/Edit Form */}
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
            <div>Search: <strong>{query ? `"${query}"` : 'No'}</strong></div>
            <div>Filter: <strong>{selectedCategory || 'All'}</strong></div>
            <div className="tip">Tip: Use categories to organize your notes</div>
          </div>
        </aside>

        {/* Center Panel - Notes List */}
        <section className="panel panel-center">
          {loading ? (
            <div className="empty">Loading notes...</div>
          ) : searching ? (
            <div className="empty">Searching...</div>
          ) : notes.length === 0 ? (
            <div className="empty">
              {query ? `No notes found for "${query}"` : 
               selectedCategory ? `No notes found in ${selectedCategory} category` : 
               'No notes found - add your first one!'}
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

        {/* Right Panel - Statistics */}
        <aside className="panel panel-right">
          <StatsDashboard />
        </aside>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        Built for quick revision • Practice hooks, state, context and effects
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
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