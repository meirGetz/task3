import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDoc } from 'firebase/firestore'; // הוספת getDoc
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
            const notesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        }, (error) => {
            console.error("Error fetching notes: ", error);
        });

        return () => unsubscribe();
    }, []);

    // הוספת בדיקת התחברות ל-Firestore
    useEffect(() => {
        const checkConnection = async () => {
            try {
                await getDoc(doc(db, "test", "testDoc")); // ודא שהמסמך קיים
                console.log("Connected to Firestore");
            } catch (error) {
                console.error("Connection error: ", error);
            }
        };
        checkConnection();
    }, []);

    const addNote = async () => {
        if (newNote.trim() === '') return;
        try {
            await addDoc(notesCollectionRef, {
                content: newNote,
                authorEmail: currentUser ? currentUser.email || 'Unknown' : 'Unknown',
                authorId: currentUser ? currentUser.uid : 'Unknown',
                createdAt: new Date(),
                versions: [{ content: newNote, timestamp: new Date() }]
            });
            setNewNote('');
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    const startEdit = (note) => {
        if (note.authorId === currentUser?.uid) {
            setEditNoteId(note.id);
            setEditContent(note.content);
        } else {
            console.error("You are not authorized to edit this note.");
        }
    };

    const saveEdit = async () => {
        if (editContent.trim() === '') return;

        try {
            const noteDocRef = doc(db, 'notes', editNoteId);
            const noteToUpdate = notes.find(note => note.id === editNoteId);

            if (noteToUpdate && noteToUpdate.authorId === currentUser?.uid) {
                await updateDoc(noteDocRef, {
                    content: editContent,
                    versions: [...noteToUpdate.versions, { content: editContent, timestamp: new Date() }]
                });

                // Clear the edit state
                setEditNoteId(null);
                setEditContent('');
            } else {
                console.error("You are not authorized to update this note.");
            }
        } catch (error) {
            console.error("Error updating note: ", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const noteDocRef = doc(db, 'notes', id);
            const noteToDelete = notes.find(note => note.id === id);

            if (noteToDelete && noteToDelete.authorId === currentUser?.uid) {
                await deleteDoc(noteDocRef);
            } else {
                console.error("You are not authorized to delete this note.");
            }
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
                                <button className="btn btn-secondary" onClick={() => setEditNoteId(null)}>Back</button>
                            </>
                        ) : (
                            <>
                                <div className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong>{note.authorEmail.slice(0, note.authorEmail.indexOf('@')) || 'Anonymous'}:</strong> {note.content}
                                    </div>
                                    <div className="mt-2">
                                        {note.authorId === currentUser?.uid && (
                                            <>
                                                <button className="btn btn-warning me-2" onClick={() => startEdit(note)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => deleteNote(note.id)}>Delete</button>
                                            </>
                                        )}
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
