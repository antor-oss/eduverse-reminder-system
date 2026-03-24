'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/firebaseConfig';
import { getUserProfile, logout } from '@/lib/services/authService';
import { createHomework } from '@/lib/services/homeworkService';

const DEPARTMENTS = ['CSE', 'EEE', 'ME', 'CE', 'BBA'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function CreateHomeworkPage() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        semester: '',
        course: '',
        deadline: '',
        isCT: false,
        ctDate: '',
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                const profile = await getUserProfile(user.uid);
                if (!profile || profile.role !== 'teacher') {
                    router.push('/auth/login');
                    return;
                }

                setUserProfile(profile);
            } catch (err) {
                console.error('প্রমাণীকরণ ত্রুটি:', err);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('লগইন করুন');
            }

            // ভ্যালিডেশন
            if (!formData.title || !formData.description || !formData.department || !formData.semester || !formData.deadline) {
                setError('সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন');
                setSubmitting(false);
                return;
            }

            if (formData.isCT && !formData.ctDate) {
                setError('পরীক্ষার তারিখ নির্ধারণ করুন');
                setSubmitting(false);
                return;
            }

            // অ্যাসাইনমেন্ট তৈরি করুন
            await createHomework({
                title: formData.title,
                description: formData.description,
                createdBy: user.uid,
                department: formData.department,
                semester: parseInt(formData.semester),
                course: formData.course || undefined,
                deadline: new Date(formData.deadline),
                isCT: formData.isCT,
                ctDate: formData.isCT ? new Date(formData.ctDate) : undefined,
            });

            setSuccess('অ্যাসাইনমেন্ট সফলভাবে তৈরি হয়েছে!');

            // ফর্ম রিসেট করুন
            setFormData({
                title: '',
                description: '',
                department: '',
                semester: '',
                course: '',
                deadline: '',
                isCT: false,
                ctDate: '',
            });

            // ড্যাশবোর্ডে রিডাইরেক্ট করুন
            setTimeout(() => {
                router.push('/teacher/dashboard');
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'অ্যাসাইনমেন্ট তৈরিতে সমস্যা হয়েছে');
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* নেভবার */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600">🎓 EduVerse</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <p className="font-semibold">{userProfile?.fullName}</p>
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

            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link href="/teacher/dashboard" className="text-green-600 hover:underline mb-4 block">
                    ← ড্যাশবোর্ডে ফিরুন
                </Link>

                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold mb-2">নতুন অ্যাসাইনমেন্ট তৈরি করুন</h1>
                    <p className="text-gray-600 mb-6">আপনার শিক্ষার্থীদের জন্য একটি নতুন অ্যাসাইনমেন্ট বা পরীক্ষা তৈরি করুন</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* শিরোনাম */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                শিরোনাম *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="অ্যাসাইনমেন্টের শিরোনাম"
                            />
                        </div>

                        {/* বর্ণনা */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                বর্ণনা *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="অ্যাসাইনমেন্টের বিস্তারিত বর্ণনা"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* বিভাগ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    বিভাগ *
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">বিভাগ নির্বাচন করুন</option>
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {/* সেমিস্টার */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    সেমিস্টার *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">সেমিস্টার নির্বাচন করুন</option>
                                    {SEMESTERS.map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* কোর্স */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                কোর্স (ঐচ্ছিক)
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="যেমন: ডাটাবেস"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* ডেডলাইন */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ডেডলাইন *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* পরীক্ষা */}
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isCT"
                                        checked={formData.isCT}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700">এটি একটি ক্লাস টেস্ট</span>
                                </label>
                            </div>
                        </div>

                        {/* পরীক্ষার তারিখ */}
                        {formData.isCT && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    পরীক্ষার তারিখ *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="ctDate"
                                    value={formData.ctDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        )}

                        {/* সাবমিট বাটন */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {submitting ? 'তৈরি করা হচ্ছে...' : 'অ্যাসাইনমেন্ট তৈরি করুন'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
