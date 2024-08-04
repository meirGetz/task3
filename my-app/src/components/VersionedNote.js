// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, updateDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
// import { useAuth } from './AuthContext';
//
// function VersionedNotes() {
//     const { currentUser } = useAuth();
//     const [notes, setNotes] = useState([]);
//     const [newNote, setNewNote] = useState('');
//     const [selectedNote, setSelectedNote] = useState(null);
//     const [versions, setVersions] = useState([]);
//     const notesCollectionRef = collection(db, 'notes');
//
//     useEffect(() => {
//         // מאזין בזמן אמת לשינויים בקולקציה
//         const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
//             setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         });
//
//         return () => unsubscribe(); // מסיר את המאזין כאשר הקומפוננטה מסיימת לעבוד
//     }, []);
//
//     const addNote = async () => {
//         if (newNote.trim() === '') return; // לא לאפשר הודעות ריקות
//         try {
//             const noteRef = await addDoc(notesCollectionRef, {
//                 content: newNote,
//                 author: currentUser ? currentUser.uid : 'anonymous',
//                 createdAt: new Date()
//             });
//             const versionRef = collection(noteRef, 'versions');
//             await addDoc(versionRef, {
//                 content: newNote,
//                 timestamp: new Date()
//             });
//             setNewNote(''); // נקה את שדה הקלט לאחר הוספת ההודעה
//         } catch (error) {
//             console.error("Error adding note: ", error);
//         }
//     };
//
//     const updateNote = async (id, newContent) => {
//         if (newContent.trim() === '') return; // לא לאפשר עדכונים ריקים
//         try {
//             const noteDoc = doc(db, 'notes', id);
//             await updateDoc(noteDoc, { content: newContent });
//             const versionRef = collection(noteDoc, 'versions');
//             await addDoc(versionRef, {
//                 content: newContent,
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             console.error("Error updating note: ", error);
//         }
//     };
//
//     const showVersions = async (noteId) => {
//         const versionRef = collection(doc(db, 'notes', noteId), 'versions');
//         const snapshot = await getDocs(versionRef);
//         setVersions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         setSelectedNote(noteId);
//     };
//
//     return (
//         <div>
//             <h1>Versioned Notes</h1>
//             <input
//                 type="text"
//                 value={newNote}
//                 onChange={(e) => setNewNote(e.target.value)}
//                 placeholder="Write a new note"
//             />
//             <button onClick={addNote}>Add Note</button>
//             <ul>
//                 {notes.map((note) => (
//                     <li key={note.id}>
//                         <input
//                             type="text"
//                             value={note.content}
//                             onChange={(e) => updateNote(note.id, e.target.value)}
//                         />
//                         <button onClick={() => showVersions(note.id)}>Show Versions</button>
//                     </li>
//                 ))}
//             </ul>
//             {selectedNote && (
//                 <div>
//                     <h2>Versions for note {selectedNote}</h2>
//                     <ul>
//                         {versions.map((version) => (
//                             <li key={version.id}>
//                                 {version.content} - {version.timestamp.toDate().toLocaleString()}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default VersionedNotes;
