'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/firebaseConfig';
import { getUserProfile, logout } from '@/lib/services/authService';
import { getTeacherHomework } from '@/lib/services/homeworkService';
import { Homework } from '@/lib/services/homeworkService';

export default function TeacherDashboard() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [homeworks, setHomeworks] = useState<(Homework & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                // প্রোফাইল লোড করুন
                const profile = await getUserProfile(user.uid);
                if (!profile || profile.role !== 'teacher') {
                    router.push('/auth/login');
                    return;
                }

                setUserProfile(profile);

                // টিচারের হোমওয়ার্ক লোড করুন
                const hwData = await getTeacherHomework(user.uid);
                setHomeworks(hwData || []);
            } catch (err) {
                console.error('ডেটা লোডিং এ সমস্যা:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (err) {
            console.error('লগআউট এ সমস্যা:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">লোড করা হচ্ছে...</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">প্রোফাইল লোড করা যায়নি</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* নেভবার */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600">🎓 EduVerse - শিক্ষক</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <p className="font-semibold">{userProfile.fullName}</p>
                            <p className="text-gray-600">শিক্ষক</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            লগআউট
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* স্বাগত বার্তা */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold mb-2">স্বাগতম, {userProfile.fullName}!</h2>
                    <p>আপনার অ্যাসাইনমেন্ট এবং ক্লাস ম্যানেজমেন্ট করুন।</p>
                </div>

                {/* অ্যাকশন বাটন */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Link
                        href="/teacher/create-homework"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-center font-semibold transition"
                    >
                        ➕ নতুন অ্যাসাইনমেন্ট তৈরি করুন
                    </Link>
                    <Link
                        href="/teacher/create-ct"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-6 text-center font-semibold transition"
                    >
                        📝 নতুন পরীক্ষা তৈরি করুন
                    </Link>
                </div>

                {/* হোমওয়ার্ক পরিসংখ্যান */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-gray-600">মোট অ্যাসাইনমেন্ট</div>
                        <div className="text-2xl font-bold">{homeworks.filter(h => !h.isCT).length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl mb-2">📝</div>
                        <div className="text-gray-600">মোট পরীক্ষা</div>
                        <div className="text-2xl font-bold">{homeworks.filter(h => h.isCT).length}</div>
                    </div>
                </div>

                {/* সমস্ত অ্যাসাইনমেন্ট */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-2xl font-bold mb-4">📚 আপনার অ্যাসাইনমেন্ট ও পরীক্ষা</h3>
                    {homeworks.length > 0 ? (
                        <div className="space-y-4">
                            {homeworks.map(hw => (
                                <div key={hw.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-lg">{hw.title}</h4>
                                                {hw.isCT && (
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                                                        পরীক্ষা
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm">{hw.description}</p>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                                            {hw.department} - সেমি {hw.semester}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-500 flex gap-4">
                                        <span>ডেডলাইন: {new Date(
                                            hw.deadline instanceof Object && 'toDate' in hw.deadline
                                                ? hw.deadline.toDate()
                                                : hw.deadline
                                        ).toLocaleDateString('bn-BD')}</span>
                                        {hw.isCT && hw.ctDate && (
                                            <span>পরীক্ষার তারিখ: {new Date(
                                                hw.ctDate instanceof Object && 'toDate' in hw.ctDate
                                                    ? hw.ctDate.toDate()
                                                    : hw.ctDate
                                            ).toLocaleDateString('bn-BD')}</span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                                            সম্পাদনা করুন
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                            ডিলিট করুন
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">এখনো কোনো অ্যাসাইনমেন্ট তৈরি করেননি।</p>
                    )}
                </div>
            </div>
        </div>
    );
}
