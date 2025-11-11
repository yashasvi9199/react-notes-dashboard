import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";
import CategoryFilter from "./components/CategoryFilter";
import StatsDashboard from "./components/StatsDashboard";
import ScrollToTop from "./components/ScrollToTop";
import { fetchNotes, createNote, updateNote, deleteNote, searchNotes, getNotesByCategory, testConnection } from "./services/notesApi";

// Import the CSS
import "./styles/styles.css";
import "./styles/components.css";

function AppInner(){
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Check database connection and load notes
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Test database connection first
      const isConnected = await testConnection();
      setDbConnected(isConnected);
      
      if (isConnected) {
        await loadNotesFromDB();
      } else {
        await loadNotesFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setDbConnected(false);
      await loadNotesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadNotesFromDB = async (category = "") => {
    try {
      let notesData;
      if (category) {
        notesData = await getNotesByCategory(category);
      } else {
        notesData = await fetchNotes();
      }
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load notes from DB:', error);
      throw error;
    }
  };

  const loadNotesFromLocalStorage = async () => {
    try {
      const storedNotes = localStorage.getItem('rn_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
      setNotes([]);
    }
  };

  const saveNotesToLocalStorage = (notesArray) => {
    try {
      localStorage.setItem('rn_notes', JSON.stringify(notesArray));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  };

  // Handle category filter change
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setQuery("");
    
    if (dbConnected) {
      await loadNotesFromDB(category);
    } else {
      // Client-side filtering for localStorage
      const storedNotes = localStorage.getItem('rn_notes');
      if (storedNotes) {
        const allNotes = JSON.parse(storedNotes);
        if (category) {
          const filtered = allNotes.filter(note => note.category === category);
          setNotes(filtered);
        } else {
          setNotes(allNotes);
        }
      }
    }
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
      if (dbConnected) {
        await loadNotesFromDB(selectedCategory);
      } else {
        await loadNotesFromLocalStorage();
      }
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      if (dbConnected) {
        const searchResults = await searchNotes(searchQuery);
        setNotes(searchResults);
      } else {
        // Client-side search for localStorage
        const storedNotes = localStorage.getItem('rn_notes');
        if (storedNotes) {
          const allNotes = JSON.parse(storedNotes);
          const searchResults = allNotes.filter(note => 
            (note.title + " " + note.content).toLowerCase().includes(searchQuery.toLowerCase())
          );
          setNotes(searchResults);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      if (dbConnected) {
        await loadNotesFromDB(selectedCategory);
      } else {
        await loadNotesFromLocalStorage();
      }
    } finally {
      setSearching(false);
    }
  }, [selectedCategory, dbConnected]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Add a note
  const addNote = async (noteData) => {
    try {
      if (dbConnected) {
        await createNote(noteData);
        await loadNotesFromDB(selectedCategory);
      } else {
        const newNote = {
          id: Date.now().toString(),
          title: noteData.title || 'Untitled',
          content: noteData.content || '',
          category: noteData.category || 'General',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_archived: false
        };
        
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
      }
      setQuery("");
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note.');
    }
  };

  // Delete note
  const deleteNoteHandler = async (id) => {
    try {
      if (dbConnected) {
        await deleteNote(id);
        await loadNotesFromDB(selectedCategory);
      } else {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
      }
      if (editing && editing.id === id) setEditing(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note.');
    }
  };

  // Save edited note
  const saveEdit = async (updated) => {
    try {
      if (dbConnected) {
        const updateData = {
          title: updated.title,
          content: updated.content,
          category: updated.category
        };
        
        await updateNote(updated.id, updateData);
        await loadNotesFromDB(selectedCategory);
      } else {
        const updatedNotes = notes.map(note => 
          note.id === updated.id ? { ...note, ...updated } : note
        );
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
      }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return(
    <div className={`app-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* Database Connection Alert */}
      {!dbConnected && (
        <div className="db-alert warning">
          <div className="alert-content">
            <strong>⚠️ Local Storage Mode</strong>
            <p>You cannot access the private database. Using localStorage in your browser. 
               <a href="https://github.com/yashasvi9199/react-notes-dashboard" target="_blank" rel="noopener noreferrer">
                 Download the project
               </a> and run it locally to use MySQL services.
            </p>
          </div>
        </div>
      )}

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
            <div>Storage: <strong>{dbConnected ? 'Database' : 'LocalStorage'}</strong></div>
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