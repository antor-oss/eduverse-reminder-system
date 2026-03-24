import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    orderBy
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export interface Homework {
    id?: string;
    title: string;
    description: string;
    createdBy: string; // Teacher UID
    department: string;
    semester: number;
    course?: string;
    deadline: Date | Timestamp;
    fileUrl?: string;
    fileName?: string;
    createdAt: Date | Timestamp;
    isCT?: boolean; // Class Test
    ctDate?: Date | Timestamp; // যদি CT হয়
    submissionUrl?: string; // Student এর কাজ জমা দেওয়ার লিংক
}

// হোমওয়ার্ক তৈরি করুন
export async function createHomework(
    homework: Omit<Homework, "id" | "createdAt">
) {
    try {
        const docRef = await addDoc(collection(db, "homework"), {
            ...homework,
            createdAt: Timestamp.now(),
            deadline: homework.deadline instanceof Date
                ? Timestamp.fromDate(homework.deadline)
                : homework.deadline,
            ctDate: homework.ctDate instanceof Date
                ? Timestamp.fromDate(homework.ctDate)
                : homework.ctDate
        });

        return docRef.id;
    } catch (error) {
        throw error;
    }
}

// সব হোমওয়ার্ক পান (টিচারের জন্য)
export async function getTeacherHomework(teacherUid: string) {
    try {
        const q = query(
            collection(db, "homework"),
            where("createdBy", "==", teacherUid),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Homework & { id: string }));
    } catch (error) {
        throw error;
    }
}

// স্টুডেন্টের জন্য হোমওয়ার্ক পান
export async function getStudentHomework(
    department: string,
    semester: number,
    course?: string
) {
    try {
        let q = query(
            collection(db, "homework"),
            where("department", "==", department),
            where("semester", "==", semester),
            orderBy("createdAt", "desc")
        );

        if (course) {
            q = query(
                collection(db, "homework"),
                where("department", "==", department),
                where("semester", "==", semester),
                where("course", "==", course),
                orderBy("createdAt", "desc")
            );
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Homework & { id: string }));
    } catch (error) {
        throw error;
    }
}

// একটি হোমওয়ার্ক আপডেট করুন
export async function updateHomework(
    homeworkId: string,
    updates: Partial<Homework>
) {
    try {
        const homeworkRef = doc(db, "homework", homeworkId);
        await updateDoc(homeworkRef, {
            ...updates,
            ...(updates.deadline && updates.deadline instanceof Date && {
                deadline: Timestamp.fromDate(updates.deadline)
            }),
            ...(updates.ctDate && updates.ctDate instanceof Date && {
                ctDate: Timestamp.fromDate(updates.ctDate)
            })
        });
    } catch (error) {
        throw error;
    }
}

// একটি হোমওয়ার্ক ডিলিট করুন
export async function deleteHomework(homeworkId: string) {
    try {
        await deleteDoc(doc(db, "homework", homeworkId));
    } catch (error) {
        throw error;
    }
}

// CT এর জন্য পরবর্তী ৫ দিনের হোমওয়ার্ক পান
export async function getUpcomingCT(department: string, semester: number) {
    try {
        const today = new Date();
        const fiveDaysLater = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

        const q = query(
            collection(db, "homework"),
            where("department", "==", department),
            where("semester", "==", semester),
            where("isCT", "==", true),
            orderBy("ctDate", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Homework & { id: string }))
            .filter(hw => {
                const ctDate = hw.ctDate instanceof Timestamp
                    ? hw.ctDate.toDate()
                    : hw.ctDate;
                return ctDate && ctDate >= today && ctDate <= fiveDaysLater;
            });
    } catch (error) {
        throw error;
    }
}

// সব আপকামিং CT পান
export async function getAllUpcomingCT() {
    try {
        const q = query(
            collection(db, "homework"),
            where("isCT", "==", true),
            orderBy("ctDate", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Homework & { id: string }));
    } catch (error) {
        throw error;
    }
}
