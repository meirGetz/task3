// Note.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // אם קובץ firebase נמצא בתיקיית src
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function Notes() {
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const notesCollectionRef = collection(db, 'notes');

    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, []);

    const addNote = async () => {
        await addDoc(notesCollectionRef, {
            content: newNote,
            author: currentUser.uid,
            createdAt: new Date()
        });
        setNewNote('');
    };

    const editNote = async (id, newContent) => {
        const noteDoc = doc(db, 'notes', id);
        await updateDoc(noteDoc, { content: newContent });
    };

    const deleteNote = async (id) => {
        const noteDoc = doc(db, 'notes', id);
        await deleteDoc(noteDoc);
    };

    return (
        <div>
            <h1>Notes</h1>
            <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a new note"
            />
            <button onClick={addNote}>Add Note</button>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <input
                            type="text"
                            value={note.content}
                            onChange={(e) => editNote(note.id, e.target.value)}
                        />
                        <button onClick={() => deleteNote(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notes;
