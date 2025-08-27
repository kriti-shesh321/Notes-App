// src/pages/NotesPage.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCtx from "../context/authContext.jsx";
import api from "../api/api.js";

export default function NotesPage() {
    const { token, logout } = useContext(AuthCtx);
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editUpdatedAt, setEditUpdatedAt] = useState(null);

    useEffect(() => {
        if (!token) navigate("/");
    }, [token, navigate]);

    useEffect(() => {
        async function load() {
            try {
                const data = await api("/notes", { token });
                setNotes(data);
            } catch (e) {
                logout();
                navigate("/");
            } finally {
                setLoading(false);
            }
        }
        if (token) load();
    }, [token, logout, navigate]);

    async function handleCreate(e) {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const newNote = await api("/notes", {
                token,
                method: "POST",
                body: { title, content },
            });
            setNotes((prev) => [newNote, ...prev]);
            setTitle("");
            setContent("");
        } catch (e) {
            alert("Could not create note.");
            console.error(e);
        }
    }

    async function handleDelete(id) {
        const prev = notes;
        setNotes((n) => n.filter((x) => x.id !== id));
        try {
            await api(`/notes/${id}`, { token, method: "DELETE" });
        } catch (e) {
            alert("Delete failed, restoring.");
            setNotes(prev);
            console.error(e);
        }
    }

    function startEdit(note) {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditUpdatedAt(note.updated_at); // capture for optimistic lock
    }

    async function saveEdit(id) {
        try {
            const updated = await api(`/notes/${id}`, {
                token,
                method: "PUT",
                body: { title: editTitle, content: editContent, updated_at: editUpdatedAt },
            });
            setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
            setEditingId(null);
        } catch (e) {
            alert("Update failed — maybe stale data. Reload notes.");
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between border-b">
                <div className="text-4xl font-semibold">Notes App</div>
                <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="underline"
                >
                    Logout
                </button>
            </header>



            <main className="max-w-4xl mx-auto px-6 space-y-10 mt-10">
                {/* Note Create form */}
                <div className="p-5 bg-gray-100 rounded space-y-5">
                    <h1 className="text-xl font-semibold text-orange-500">Add a Note...</h1>
                    <form onSubmit={handleCreate} className="grid gap-3">
                        <input
                            className="border rounded px-3 py-2 bg-white"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="border rounded px-3 py-2 bg-white"
                            rows="3"
                            placeholder="Content (optional)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button className="w-32 bg-gray-900 text-white py-2 rounded hover:bg-gray-800">
                            Add note
                        </button>
                    </form>
                </div>

                {/* Notes LIist */}
                <div className="p-5 bg-blue-100 rounded space-y-5 mt-10">
                    <h2 className="text-lg font-medium text-gray-600">Previous Notes</h2>
                    {loading ? (
                        <div className="text-gray-600">Loading…</div>
                    ) : notes.length === 0 ? (
                        <div className="text-gray-600">No notes yet.</div>
                    ) : (
                        <ul className="grid gap-3">
                            {notes.map((n) => (
                                <li key={n.id} className="bg-white border rounded p-3">
                                    {editingId === n.id ? (
                                        <>
                                            <input
                                                className="border rounded px-2 py-1 w-full mb-2"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <textarea
                                                className="border rounded px-2 py-1 w-full mb-2"
                                                rows="3"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(n.id)}
                                                    className="text-xs bg-gray-900 text-white px-3 py-1 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-xs underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="font-medium">{n.title}</div>
                                            {n.content && (
                                                <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
                                                    {n.content}
                                                </div>
                                            )}
                                            <div className="mt-2 flex gap-4">
                                                <button
                                                    onClick={() => startEdit(n)}
                                                    className="text-sm underline text-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(n.id)}
                                                    className="text-sm underline text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}