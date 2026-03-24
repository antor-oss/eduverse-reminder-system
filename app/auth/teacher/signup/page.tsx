'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/services/authService';

export default function TeacherSignup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            if (!formData.fullName || !formData.email || !formData.password) {
                setError('সমস্ত ফিল্ড পূরণ করুন');
                setLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('পাসওয়ার্ড মিলছে না');
                setLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
                setLoading(false);
                return;
            }

            // সাইনআপ করুন
            await signup(
                formData.email,
                formData.password,
                formData.fullName,
                'teacher'
            );

            // ড্যাশবোর্ডে রিডাইরেক্ট করুন
            router.push('/teacher/dashboard');
        } catch (err: any) {
            setError(err.message || 'সাইনআপ ব্যর্থ হয়েছে');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">👨‍🏫</div>
                        <h1 className="text-3xl font-bold text-gray-900">শিক্ষক সাইনআপ</h1>
                        <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্ট তৈরি করুন</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* নাম */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                সম্পূর্ণ নাম
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="আপনার নাম"
                            />
                        </div>

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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="পাসওয়ার্ড তৈরি করুন"
                            />
                        </div>

                        {/* কনফার্ম পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                পাসওয়ার্ড কনফার্ম করুন
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="পাসওয়ার্ড আবার লিখুন"
                            />
                        </div>

                        {/* সাবমিট বাটন */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? 'সাইনআপ করা হচ্ছে...' : 'সাইনআপ করুন'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
                            <Link href="/auth/login" className="text-green-600 hover:underline font-semibold">
                                লগইন করুন
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
