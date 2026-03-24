"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";

interface Reminder {
    id?: string;
    title: string;
    description: string;
    dueDate: Timestamp;
    createdBy: string;
}

export default function TeacherDashboard() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const teacherEmail = auth.currentUser?.email || "teacher@example.com"; // fallback demo

    const fetchReminders = async () => {
        const q = query(
            collection(db, "reminders"),
            where("createdBy", "==", teacherEmail),
            orderBy("dueDate", "asc")
        );
        const snapshot = await getDocs(q);
        const data: Reminder[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reminder));
        setReminders(data);
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleAddReminder = async () => {
        if (!title || !description || !dueDate) return alert("Fill all fields!");
        await addDoc(collection(db, "reminders"), {
            title,
            description,
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            createdBy: teacherEmail,
            createdAt: Timestamp.now(),
        });
        setTitle(""); setDescription(""); setDueDate("");
        fetchReminders();
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-800 to-pink-700 text-white p-6">
            <h1 className="text-5xl font-extrabold mb-6 animate-pulse">👨‍🏫 Teacher Dashboard</h1>

            <div className="mb-8 p-6 bg-white text-purple-900 rounded-2xl shadow-2xl max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Add Reminder</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mb-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mb-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 mb-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleAddReminder}
                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
                >
                    Add Reminder
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reminders.map((r) => (
                    <div key={r.id} className="bg-white text-purple-900 rounded-2xl p-4 shadow-lg">
                        <h3 className="font-bold text-xl">{r.title}</h3>
                        <p>{r.description}</p>
                        <p className="text-sm mt-1">Due: {r.dueDate.toDate().toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}