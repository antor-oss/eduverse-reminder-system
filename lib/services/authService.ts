import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

export type UserRole = "student" | "teacher";

export interface UserProfile {
    uid: string;
    email: string;
    role: UserRole;
    fullName: string;
    department?: string;
    semester?: number;
    createdAt: Date;
    profileImage?: string;
}

// সাইনআপ করুন
export async function signup(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    department?: string,
    semester?: number
) {
    try {
        // Firebase Auth এ ইউজার তৈরি করুন
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore এ ইউজার প্রোফাইল সংরক্ষণ করুন
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            role,
            fullName,
            department: role === "student" ? department : undefined,
            semester: role === "student" ? semester : undefined,
            createdAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), userProfile);

        return { user, userProfile };
    } catch (error) {
        throw error;
    }
}

// লগইন করুন
export async function login(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ইউজার প্রোফাইল পান
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            throw new Error("ইউজার প্রোফাইল পাওয়া যায়নি");
        }

        return { user, userProfile: userDoc.data() as UserProfile };
    } catch (error) {
        throw error;
    }
}

// লগআউট করুন
export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

// ইউজার প্রোফাইল পান
export async function getUserProfile(uid: string) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) {
            return null;
        }
        return userDoc.data() as UserProfile;
    } catch (error) {
        throw error;
    }
}

// সব স্টুডেন্ট পান
export async function getAllStudents(department?: string, semester?: number) {
    try {
        let q = query(
            collection(db, "users"),
            where("role", "==", "student")
        );

        if (department) {
            q = query(
                collection(db, "users"),
                where("role", "==", "student"),
                where("department", "==", department)
            );
        }

        if (semester && department) {
            q = query(
                collection(db, "users"),
                where("role", "==", "student"),
                where("department", "==", department),
                where("semester", "==", semester)
            );
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
        throw error;
    }
}

// সব টিচার পান
export async function getAllTeachers() {
    try {
        const q = query(
            collection(db, "users"),
            where("role", "==", "teacher")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
        throw error;
    }
}
