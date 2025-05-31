import { useState, useEffect } from 'react';
import { fetchNotes, createNote, likeNote, unlikeNote, deleteNote } from './services/api';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState({ content: '', author: '' });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdNote = await createNote(newNote);
      setNotes([createdNote, ...notes]);
      setNewNote({ content: '', author: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const handleLike = async (id) => {
    try {
      const updatedNote = await likeNote(id);
      setNotes(notes.map(note => 
        note._id === id ? updatedNote : note
      ));
    } catch (err) {
      setError('Failed to like note');
    }
  };

  const handleUnlike = async (id) => {
    try {
      const updatedNote = await unlikeNote(id);
      setNotes(notes.map(note => 
        note._id === id ? updatedNote : note
      ));
    } catch (err) {
      setError('Failed to unlike note');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="app">
      <h1>Mini Twitter</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Your name"
          value={newNote.author}
          onChange={(e) => setNewNote({ ...newNote, author: e.target.value })}
          required
        />
        <textarea
          placeholder="Hello World"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <button type="submit">Post Note</button>
      </form>

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : (
        <div className="notes-wall">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              <p className="note-content">{note.content}</p>
              <div className="note-meta">
                <span className="author">By {note.author}</span>
                <span className="date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="note-actions">
                <button onClick={() => handleLike(note._id)} aria-label={`Like note by ${note.author}`}>
                  Like {note.likes ?? 0}
                </button>
                <button onClick={() => handleUnlike(note._id)} aria-label={`Dislike note by ${note.author}`}>
                  Dislike
                </button>
                <button onClick={() => handleDelete(note._id)} aria-label={`Delete note by ${note.author}`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
