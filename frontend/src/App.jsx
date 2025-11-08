import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const API_URL = '/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch all notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new note
  const createNote = async () => {
    if (!formData.title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      closeModal();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update note
  const updateNote = async () => {
    if (!formData.title.trim() || !editingNote) return;

    try {
      const response = await fetch(`${API_URL}/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updatedNote = await response.json();
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
      closeModal();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Modal handlers
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Notes</h1>
          <p style={styles.subtitle}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          {notes.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h2 style={styles.emptyTitle}>No notes yet</h2>
              <p style={styles.emptyText}>Create your first note to get started</p>
            </div>
          ) : (
            <div style={styles.notesGrid}>
              {notes.map((note) => (
                <div key={note.id} style={styles.noteCard}>
                  <div style={styles.noteHeader}>
                    <h3 style={styles.noteTitle}>{note.title}</h3>
                    <div style={styles.noteActions}>
                      <button
                        onClick={() => openModal(note)}
                        style={styles.actionButton}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        style={styles.actionButton}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p style={styles.noteContent}>{note.content || 'No content'}</p>
                  <div style={styles.noteFooter}>
                    {new Date(note.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FAB Button */}
      <button
        onClick={() => openModal()}
        style={styles.fab}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>
              <button onClick={closeModal} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title..."
                  style={styles.input}
                  autoFocus
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your note here..."
                  style={styles.textarea}
                  rows={8}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveButton}>
                  <Save size={16} />
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--accent-sage)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    padding: '2rem 0',
    boxShadow: 'var(--shadow-sm)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  main: {
    padding: '3rem 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'var(--text-secondary)',
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  noteCard: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  noteTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    flex: 1,
    marginRight: '1rem',
  },
  noteActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    background: 'var(--bg-secondary)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease',
  },
  noteContent: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  noteFooter: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
  },
  fab: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-sage), var(--accent-blue))',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-lg)',
    transition: 'transform 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 1000,
  },
  modal: {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s ease',
  },
  form: {
    padding: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    background: 'var(--accent-sage)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  },
};

// Add keyframes for loader animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;