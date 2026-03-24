'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/services/authService';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // ভ্যালিডেশন
            if (!formData.email || !formData.password) {
                setError('ইমেইল এবং পাসওয়ার্ড প্রবেশ করুন');
                setLoading(false);
                return;
            }

            // লগইন করুন
            const { userProfile } = await login(formData.email, formData.password);

            // রোল অনুযায়ী রিডাইরেক্ট করুন
            if (userProfile.role === 'student') {
                router.push('/student/dashboard');
            } else if (userProfile.role === 'teacher') {
                router.push('/teacher/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'লগইন ব্যর্থ হয়েছে');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🎓</div>
                        <h1 className="text-3xl font-bold text-gray-900">লগইন করুন</h1>
                        <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ইমেইল */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ইমেইল
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="আপনার ইমেইল"
                            />
                        </div>

                        {/* পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                পাসওয়ার্ড
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="আপনার পাসওয়ার্ড"
                            />
                        </div>

                        {/* পাসওয়ার্ড ভুলে গেছেন */}
                        <div className="text-right">
                            <Link href="#" className="text-sm text-purple-600 hover:underline">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>

                        {/* লগইন বাটন */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            {loading ? 'লগইন করা হচ্ছে...' : 'লগইন করুন'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            অ্যাকাউন্ট নেই?{' '}
                            <Link href="/auth" className="text-purple-600 hover:underline font-semibold">
                                সাইন আপ করুন
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/auth" className="text-gray-600 hover:underline">
                            ← ফিরে যান
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
