"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

interface Reminder {
    id?: string;
    title: string;
    description: string;
    dueDate: Timestamp;
    createdBy: string;
}

export default function StudentDashboard() {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const fetchReminders = async () => {
        const q = query(collection(db, "reminders"), orderBy("dueDate", "asc"));
        const snapshot = await getDocs(q);
        const data: Reminder[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Reminder));
        setReminders(data);
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-700 to-teal-600 text-white flex flex-col items-center p-6">
            <h1 className="text-5xl font-extrabold mb-6 animate-bounce">👨‍🎓 Student Dashboard</h1>
            <p className="text-lg mb-8">View all reminders from your teachers</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {reminders.map((r) => (
                    <div key={r.id} className="bg-white text-green-800 rounded-2xl p-4 shadow-lg">
                        <h3 className="font-bold text-xl">{r.title}</h3>
                        <p>{r.description}</p>
                        <p className="text-sm mt-1">Due: {r.dueDate.toDate().toLocaleDateString()}</p>
                        <p className="text-xs mt-1">By: {r.createdBy}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}