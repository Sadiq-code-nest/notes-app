import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const API_URL = '/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!formData.title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const updateNote = async () => {
    if (!formData.title.trim() || !editingNote) return;
    try {
      const res = await fetch(`${API_URL}/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedNote = await res.json();
      setNotes(notes.map(n => n.id === editingNote.id ? updatedNote : n));
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({ title: note.title, content: note.content });
    } else {
      setEditingNote(null);
      setFormData({ title: '', content: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingNote ? updateNote() : createNote();
  };

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Notes</h1>
          <p className="subtitle">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="container">
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h2 className="empty-title">No notes yet</h2>
              <p className="empty-text">Create your first note to get started</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note, idx) => {
                const colors = ['note-blue','note-green','note-yellow','note-purple','note-pink'];
                const noteClass = colors[idx % colors.length];
                return (
                  <div key={note.id} className={`note-card ${noteClass}`}>
                    <div className="note-header">
                      <h3 className="note-title">{note.title}</h3>
                      <div className="note-actions">
                        <button onClick={() => openModal(note)} className="action-button edit">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => deleteNote(note.id)} className="action-button delete">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                    <p className="note-content">{note.content || 'No content'}</p>
                    <div className="note-footer">
                      {new Date(note.created_at).toLocaleDateString('en-US',{
                        month:'short', day:'numeric', year:'numeric'
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <button onClick={() => openModal()} className="fab">
        <Plus size={24}/>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingNote ? 'Edit Note' : 'New Note'}</h2>
              <button onClick={closeModal} className="close-button"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="label">Title</label>
                <input type="text" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="Enter note title..." autoFocus required className="input"/>
              </div>
              <div className="form-group">
                <label className="label">Content</label>
                <textarea value={formData.content} onChange={e=>setFormData({...formData,content:e.target.value})} placeholder="Write your note here..." rows={8} className="textarea"/>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                <button type="submit" className="save-button"><Save size={16}/> {editingNote ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
