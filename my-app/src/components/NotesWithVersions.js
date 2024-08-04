import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function NotesWithVersions() {
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const notesCollectionRef = collection(db, 'notes'); // ודא שהנתיב נכון

    useEffect(() => {
        // מאזין בזמן אמת לשינויים בקולקציה
        const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        });

        return () => unsubscribe(); // מסיר את המאזין כאשר הקומפוננטה מסיימת לעבוד
    }, []);

    const addNote = async () => {
        if (newNote.trim() === '') return; // לא לאפשר הודעות ריקות
        try {
            await addDoc(notesCollectionRef, {
                content: newNote,
                author: currentUser ? currentUser.uid : 'anonymous',
                authorName: currentUser ? currentUser.displayName || 'Unknown' : 'Unknown',
                createdAt: new Date()
            });
            setNewNote(''); // נקה את שדה הקלט לאחר הוספת ההודעה
        } catch (error) {
            console.error("Error adding note: ", error);
        }
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
                        <strong>{note.authorName || 'Anonymous'}:</strong> {note.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotesWithVersions;
