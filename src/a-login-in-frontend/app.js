import React, { useState, useEffect } from "react";
// import axios from "axios";
import noteService from "../services/notes";
// import { getAll, create, update } from "../services/notes";
import Note from "./components/note";
import Notification from "./components/notification";
import Footer from "./components/footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const hook = () => {
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  };

  useEffect(hook, []);

  const addNote = (event) => {
    event.preventDefault();

    const noteOject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteOject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportance = (event) => {
    setShowAll(!showAll);
  };

  const toggleImportanceOf = (id) => {
    const noteObject = notes.find((note) => note.id === id);
    const changedNote = { ...noteObject, important: !noteObject.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((err) => {
        setErrorMessage(
          `the note '${noteObject.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 4000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  console.log(showAll);
  console.log(notesToShow);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={toggleImportance}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" placeholder={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
