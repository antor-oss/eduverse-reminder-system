import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    Timestamp,
    orderBy
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export type NotificationType = "homework" | "ct_reminder" | "general";

export interface Notification {
    id?: string;
    userId: string; // যাকে নোটিফিকেশন দেওয়া হচ্ছে
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string; // Homework ID যদি থাকে
    isRead: boolean;
    createdAt: Date | Timestamp;
    sendEmail?: boolean;
}

// নোটিফিকেশন তৈরি করুন
export async function createNotification(
    notification: Omit<Notification, "id" | "createdAt">
) {
    try {
        const docRef = await addDoc(collection(db, "notifications"), {
            ...notification,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

// একজন ইউজারের সব নোটিফিকেশন পান
export async function getUserNotifications(userId: string) {
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification & { id: string }));
    } catch (error) {
        throw error;
    }
}

// পড়া না-পড়া নোটিফিকেশন পান
export async function getUnreadNotifications(userId: string) {
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            where("isRead", "==", false),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification & { id: string }));
    } catch (error) {
        throw error;
    }
}

// নোটিফিকেশন পড়েছে বলে চিহ্নিত করুন
export async function markAsRead(notificationId: string) {
    try {
        const notifRef = doc(db, "notifications", notificationId);
        await updateDoc(notifRef, {
            isRead: true
        });
    } catch (error) {
        throw error;
    }
}

// সব নোটিফিকেশন পড়েছে বলে চিহ্নিত করুন
export async function markAllAsRead(userId: string) {
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            where("isRead", "==", false)
        );
        const snapshot = await getDocs(q);

        for (const doc of snapshot.docs) {
            await updateDoc(doc.ref, {
                isRead: true
            });
        }
    } catch (error) {
        throw error;
    }
}

// একজন স্টুডেন্টকে হোমওয়ার্কের নোটিফিকেশন দিন
export async function notifyHomework(
    studentUid: string,
    homeworkId: string,
    title: string,
    message: string
) {
    try {
        await createNotification({
            userId: studentUid,
            type: "homework",
            title,
            message,
            relatedId: homeworkId,
            isRead: false,
            sendEmail: true
        });
    } catch (error) {
        throw error;
    }
}

// CT রিমাইন্ডার নোটিফিকেশন দিন
export async function notifyCTReminder(
    studentUid: string,
    ctId: string,
    ctTitle: string,
    daysToGo: number
) {
    try {
        await createNotification({
            userId: studentUid,
            type: "ct_reminder",
            title: `⏰ ${ctTitle} - ${daysToGo} দিন বাকি`,
            message: `আপনার ${ctTitle} পরীক্ষা ${daysToGo} দিন পরে অনুষ্ঠিত হবে।`,
            relatedId: ctId,
            isRead: false,
            sendEmail: true
        });
    } catch (error) {
        throw error;
    }
}

// একটি বিভাগ এবং সেমিস্টারের সব স্টুডেন্টকে নোটিফাই করুন
export async function notifyDepartmentStudents(
    department: string,
    semester: number,
    title: string,
    message: string,
    relatedId?: string,
    notificationType: NotificationType = "general"
) {
    try {
        // আমরা এটি homework service এ সব স্টুডেন্ট পেতে পারি
        // এখানে আমরা শুধু ফাংশন স্ট্রাকচার দিচ্ছি
        // প্রকৃত বাস্তবায়নে আপনাকে স্টুডেন্ট IDs পেতে হবে

        return {
            department,
            semester,
            title,
            message,
            relatedId
        };
    } catch (error) {
        throw error;
    }
}
