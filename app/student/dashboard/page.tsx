'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { getUserProfile, logout } from '@/lib/services/authService';
import { getStudentHomework, getUpcomingCT } from '@/lib/services/homeworkService';
import { getUserNotifications, getUnreadNotifications } from '@/lib/services/notificationService';
import { Homework } from '@/lib/services/homeworkService';
import { Notification } from '@/lib/services/notificationService';

export default function StudentDashboard() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [homeworks, setHomeworks] = useState<(Homework & { id: string })[]>([]);
    const [upcomingCTs, setUpcomingCTs] = useState<(Homework & { id: string })[]>([]);
    const [notifications, setNotifications] = useState<(Notification & { id: string })[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
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
                if (!profile) {
                    router.push('/auth/login');
                    return;
                }

                setUserProfile(profile);

                // হোমওয়ার্ক লোড করুন
                if (profile.department && profile.semester) {
                    const hwData = await getStudentHomework(profile.department, profile.semester);
                    setHomeworks(hwData || []);

                    // আপকামিং CT লোড করুন
                    const ctData = await getUpcomingCT(profile.department, profile.semester);
                    setUpcomingCTs(ctData || []);
                }

                // নোটিফিকেশন লোড করুন
                const notifData = await getUserNotifications(user.uid);
                setNotifications(notifData || []);

                const unreadNotifs = await getUnreadNotifications(user.uid);
                setUnreadCount(unreadNotifs?.length || 0);
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
                    <h1 className="text-2xl font-bold text-blue-600">🎓 EduVerse</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button className="relative text-2xl">
                                🔔
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">{userProfile.fullName}</p>
                            <p className="text-gray-600">{userProfile.department} - সেমিস্টার {userProfile.semester}</p>
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
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold mb-2">স্বাগতম, {userProfile.fullName}!</h2>
                    <p>আপনার সমস্ত অ্যাসাইনমেন্ট এবং নোটিফিকেশন এখানে পাবেন।</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {/* পরিসংখ্যান */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-gray-600">মোট অ্যাসাইনমেন্ট</div>
                        <div className="text-2xl font-bold">{homeworks.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl mb-2">⏰</div>
                        <div className="text-gray-600">আসন্ন পরীক্ষা</div>
                        <div className="text-2xl font-bold">{upcomingCTs.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl mb-2">🔔</div>
                        <div className="text-gray-600">নতুন নোটিফিকেশন</div>
                        <div className="text-2xl font-bold">{unreadCount}</div>
                    </div>
                </div>

                {/* আসন্ন পরীক্ষা */}
                {upcomingCTs.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-2xl font-bold mb-4">⏰ আসন্ন পরীক্ষা</h3>
                        <div className="space-y-4">
                            {upcomingCTs.map(ct => (
                                <div key={ct.id} className="border-l-4 border-red-500 pl-4 py-2">
                                    <h4 className="font-semibold text-lg">{ct.title}</h4>
                                    <p className="text-gray-600 text-sm">{ct.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* অ্যাসাইনমেন্ট */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-2xl font-bold mb-4">📚 আপনার অ্যাসাইনমেন্ট</h3>
                    {homeworks.length > 0 ? (
                        <div className="space-y-4">
                            {homeworks.map(hw => (
                                <div key={hw.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{hw.title}</h4>
                                            <p className="text-gray-600 text-sm">{hw.description}</p>
                                            {hw.fileName && (
                                                <p className="text-sm text-blue-600 mt-2">📄 {hw.fileName}</p>
                                            )}
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                                            {hw.course || 'সাধারণ'}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-500">
                                        ডেডলাইন: {new Date(
                                            hw.deadline instanceof Object && 'toDate' in hw.deadline
                                                ? hw.deadline.toDate()
                                                : hw.deadline
                                        ).toLocaleDateString('bn-BD')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">এখনো কোনো অ্যাসাইনমেন্ট নেই।</p>
                    )}
                </div>

                {/* সাম্প্রতিক নোটিফিকেশন */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-2xl font-bold mb-4">🔔 নোটিফিকেশন</h3>
                    {notifications.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.slice(0, 5).map(notif => (
                                <div
                                    key={notif.id}
                                    className={`p-3 rounded-lg border-l-4 ${notif.isRead ? 'bg-gray-50 border-gray-400' : 'bg-blue-50 border-blue-500'
                                        }`}
                                >
                                    <p className="font-semibold">{notif.title}</p>
                                    <p className="text-sm text-gray-600">{notif.message}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">কোনো নোটিফিকেশন নেই।</p>
                    )}
                </div>
            </div>
        </div>
    );
}
