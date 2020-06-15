import React, { useState, useEffect } from "react";
import noteService from "../services/notes";
import Note from "./components/note";
import Notification from "./components/notification";
import Footer from "./components/footer";
import loginService from "../services/login";
import LoginForm from "./components/login-form";
import Togglable from "./components/togglable";
import NoteForm from "./components/note-form";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(true);

  const hook = () => {
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  };

  useEffect(hook, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("loggedNoteappUser");
    noteService.setToken(null);
    setUser(null);
  };

  const noteForm = () => (
    <Togglable buttonLabel="New Note">
      <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
      />
    </Togglable>
  );

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        {user === null ? (
          loginForm()
        ) : (
          <div>
            <p>Welcome : {user.name}</p>
            <button onClick={handleLogout}>Logout</button>
            {noteForm()}
          </div>
        )}
      </div>
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
      <Footer />
    </div>
  );
};

export default App;
