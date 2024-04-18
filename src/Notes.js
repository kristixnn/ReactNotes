import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Notes = () => {
  const loggedUserId = sessionStorage.getItem("username");
  // Assuming you pass the logged-in user's ID as a prop
  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch("http://localhost:3000/notes")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => {
        toast.error("Failed to fetch notes: " + err.message);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingNoteId) {
      handleSaveEdit();
    } else {
      // Send a POST request to create a new note
      const newNote = { noteName, noteDescription };

      fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newNote),
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Note created successfully.");
            fetchNotes();
            setNoteName("");
            setNoteDescription("");
          } else {
            return res.json().then((data) => {
              throw new Error(data.message || "Failed to create note.");
            });
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleEdit = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    setNoteName(noteToEdit.noteName);
    setNoteDescription(noteToEdit.noteDescription);
    setEditingNoteId(noteId);
  };

  const handleSaveEdit = () => {
    const editedNote = { noteName, noteDescription };

    fetch(`http://localhost:3000/notes/${editingNoteId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editedNote),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Note edited successfully.");
          fetchNotes();
          setNoteName("");
          setNoteDescription("");
          setEditingNoteId(null);
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to edit note.");
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="card-header">
          <h1>Enter text</h1>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Note Name <span className="errmsg">*</span>
                </label>
                <input
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>
                  Note Description <span className="errmsg">*</span>
                </label>
                <input
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>

      <div>
        <h2>Notes</h2>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <strong>{note.noteName}</strong>: {note.noteDescription}{" "}
              <button onClick={() => handleEdit(note.id)}>Edit</button>
              {/* This button opens the edit window */}
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Note Window */}
      {editingNoteId && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditingNoteId(null)}>
              &times;
            </span>
            <h2>Edit Note</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Note Name:</label>
                <input
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Note Description:</label>
                <input
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
