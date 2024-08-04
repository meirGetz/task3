import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function NotesWithVersions() {
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [showHistoryForNoteId, setShowHistoryForNoteId] = useState(null);
    const notesCollectionRef = collection(db, 'notes');

    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        }, (error) => {
            console.error("Error fetching notes: ", error);
        });

        return () => unsubscribe();
    }, []);

    const addNote = async () => {
        if (newNote.trim() === '') return;
        try {
            await addDoc(notesCollectionRef, {
                content: newNote,
                author: currentUser ? currentUser.uid : 'anonymous',
                authorName: currentUser ? currentUser.displayName || 'Unknown' : 'Unknown',
                createdAt: new Date(),
                versions: [{ content: newNote, timestamp: new Date() }]
            });
            setNewNote('');
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    const startEdit = (note) => {
        setEditNoteId(note.id);
        setEditContent(note.content);
    };

    const saveEdit = async () => {
        if (editContent.trim() === '') return;

        try {
            const noteDocRef = doc(db, 'notes', editNoteId);
            const noteToUpdate = notes.find(note => note.id === editNoteId);

            if (noteToUpdate) {
                await updateDoc(noteDocRef, {
                    content: editContent,
                    versions: [...noteToUpdate.versions, { content: editContent, timestamp: new Date() }]
                });

                // Clear the edit state
                setEditNoteId(null);
                setEditContent('');
            }
        } catch (error) {
            console.error("Error updating note: ", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const noteDocRef = doc(db, 'notes', id);
            await deleteDoc(noteDocRef);
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    const toggleHistory = (id) => {
        setShowHistoryForNoteId(showHistoryForNoteId === id ? null : id);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Notes</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a new note"
                />
                <button className="btn btn-primary mt-2" onClick={addNote}>Add Note</button>
            </div>
            <ul className="list-group">
                {notes.map((note) => (
                    <li key={note.id} className="list-group-item mb-3">
                        {editNoteId === note.id ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <button className="btn btn-success me-2" onClick={saveEdit}>Save</button>
                                <button className="btn btn-secondary" onClick={() => setEditNoteId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>{note.authorName || 'Anonymous'}:</strong> {note.content}
                                    <div>
                                        <button className="btn btn-warning me-2" onClick={() => startEdit(note)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => deleteNote(note.id)}>Delete</button>
                                        <button className="btn btn-info ms-2" onClick={() => toggleHistory(note.id)}>
                                            {showHistoryForNoteId === note.id ? 'Hide History' : 'Show History'}
                                        </button>
                                    </div>
                                </div>
                                {showHistoryForNoteId === note.id && (
                                    <ul className="list-group mt-2">
                                        {note.versions.map((version, index) => (
                                            <li key={index} className="list-group-item list-group-item-secondary">
                                                {version.content} (Edited on {version.timestamp.toDate().toLocaleString()})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotesWithVersions;
