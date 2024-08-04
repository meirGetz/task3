// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // הנחה שקובץ firebase נמצא בתיקיית src
// import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
// import { useAuth } from './AuthContext';
//
// function Note() {
//     const { currentUser } = useAuth();
//     const [notes, setNotes] = useState([]);
//     const [newNote, setNewNote] = useState('');
//
//     // יצירת reference לקולקציה
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
//         if (newNote.trim()) { // לבדוק שההערה אינה ריקה
//             const userName = currentUser.displayName || "Unknown"; // קבלת שם המשתמש או "Unknown"
//             await addDoc(notesCollectionRef, {
//                 content: newNote,
//                 author: currentUser.uid,
//                 authorName: userName, // הוסף את שם הכותב
//                 createdAt: new Date()
//             });
//             setNewNote('');
//         }
//     };
//
//     const editNote = async (id, newContent) => {
//         if (newContent.trim()) { // לבדוק שהתוכן אינו ריק
//             const noteDoc = doc(db, 'notes', id);
//             await updateDoc(noteDoc, { content: newContent });
//         }
//     };
//
//     const deleteNote = async (id) => {
//         const noteDoc = doc(db, 'notes', id);
//         await deleteDoc(noteDoc);
//     };
//
//     return (
//         <div>
//             <h1>Notes</h1>
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
//                         <strong>{note.authorName}:</strong> {/* הוסף את שם הכותב כאן */}
//                         <input
//                             type="text"
//                             value={note.content}
//                             onChange={(e) => editNote(note.id, e.target.value)}
//                         />
//                         <button onClick={() => deleteNote(note.id)}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
//
// export default Note;
