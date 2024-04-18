import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [notes, setNotes] = useState([]);

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

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/notes/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        toast.success("Note deleted successfully.");
        fetchNotes();
      })
      .catch((err) => {
        toast.error("Failed to delete note: " + err.message);
      });
  };

  const downloadNote = (note) => {
    let noteText = `Title: ${note.noteName}\nDescription: ${note.noteDescription}\n\n`;
    const element = document.createElement("a");
    const file = new Blob([noteText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${note.noteName}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Your Notes</h1>
      <Link to="/notes" className="btn btn-primary mb-2">
        Add Note
      </Link>
      <div className="list-group">
        {notes.map((note) => (
          <div key={note.id} className="list-group-item">
            <h5 className="mb-1">{note.noteName}</h5>
            <p className="mb-1">{note.noteDescription}</p>
            <div>
              <Link to={`/notes`} className="btn btn-primary mr-2">
                Edit
              </Link>
              <button
                onClick={() => downloadNote(note)}
                className="btn btn-secondary mr-2"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
