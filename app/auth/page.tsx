'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AuthPage() {
    const [isHovered, setIsHovered] = useState<'student' | 'teacher' | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">🎓 EduVerse</h1>
                    <p className="text-xl text-gray-600">শিক্ষার্থী এবং শিক্ষকদের জন্য অনলাইন ক্লাশরুম সিস্টেম</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* স্টুডেন্ট কার্ড */}
                    <div
                        className={`relative group cursor-pointer transition-all duration-300 ${isHovered === 'student' ? 'scale-105' : ''
                            }`}
                        onMouseEnter={() => setIsHovered('student')}
                        onMouseLeave={() => setIsHovered(null)}
                    >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all">
                            <div className="text-6xl mb-4">👨‍🎓</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">স্টুডেন্ট</h2>
                            <p className="text-gray-600 mb-6">
                                আপনার অ্যাসাইনমেন্ট, সময়সূচী এবং গ্রেড একটি জায়গায় পান।
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    href="/auth/student/signup"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                                >
                                    সাইন আপ করুন
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                                >
                                    লগইন করুন
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* টিচার কার্ড */}
                    <div
                        className={`relative group cursor-pointer transition-all duration-300 ${isHovered === 'teacher' ? 'scale-105' : ''
                            }`}
                        onMouseEnter={() => setIsHovered('teacher')}
                        onMouseLeave={() => setIsHovered(null)}
                    >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all">
                            <div className="text-6xl mb-4">👨‍🏫</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">শিক্ষক</h2>
                            <p className="text-gray-600 mb-6">
                                আপনার শিক্ষার্থীদের অ্যাসাইনমেন্ট দিন এবং গ্রেড দিন।
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    href="/auth/teacher/signup"
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                                >
                                    সাইন আপ করুন
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition text-center"
                                >
                                    লগইন করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* বৈশিষ্ট্যগুলি */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">আমাদের বৈশিষ্ট্যগুলি</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">📚</div>
                            <h4 className="font-semibold mb-2">অ্যাসাইনমেন্ট</h4>
                            <p className="text-gray-600 text-sm">সহজে অ্যাসাইনমেন্ট পাঠান এবং গ্রেড করুন</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🔔</div>
                            <h4 className="font-semibold mb-2">বিজ্ঞপ্তি</h4>
                            <p className="text-gray-600 text-sm">সমস্ত আপডেটের জন্য তাৎক্ষণিক সতর্কতা পান</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">📅</div>
                            <h4 className="font-semibold mb-2">সময়সূচী</h4>
                            <p className="text-gray-600 text-sm">সমস্ত ক্লাস এবং পরীক্ষার সময়সূচী দেখুন</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
