// VersionedNote.js
import React, {useEffect, useState} from 'react';
import { auth, db } from '../firebase'; // אם קובץ firebase נמצא בתיקיית src
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function VersionedNotes() {
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
        const noteRef = await addDoc(notesCollectionRef, {
            content: newNote,
            author: currentUser.uid,
            createdAt: new Date()
        });
        const versionRef = collection(noteRef, 'versions');
        await addDoc(versionRef, {
            content: newNote,
            timestamp: new Date()
        });
        setNewNote('');
    };

    const updateNote = async (id, newContent) => {
        const noteDoc = doc(db, 'notes', id);
        await updateDoc(noteDoc, { content: newContent });
        const versionRef = collection(noteDoc, 'versions');
        await addDoc(versionRef, {
            content: newContent,
            timestamp: new Date()
        });
    };

    return (
        <div>
            <h1>Versioned Notes</h1>
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
                            onChange={(e) => updateNote(note.id, e.target.value)}
                        />
                        {/* Implement version history viewing */}
                        <button>Show Versions</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VersionedNotes;
