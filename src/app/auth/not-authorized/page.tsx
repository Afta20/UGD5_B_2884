'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import { ShieldAlert } from 'lucide-react';

const NotAuthorizedPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Otomatis diarahkan kembali ke halaman login setelah 3 detik 
        const timeout = setTimeout(() => {
            router.push('/auth/login');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <AuthFromWrapper title="Access Denied">
            <div className="flex flex-col items-center text-center p-6 space-y-6">
                {/* Icon Peringatan */}
                <div className="bg-red-100 p-4 rounded-full text-red-600 animate-bounce">
                    <ShieldAlert size={48} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Anda belum login</h2> 
                    <p className="text-sm text-gray-500">
                        Halaman ini diproteksi. Anda tidak diperbolehkan mengakses halaman game secara langsung melalui URL. 
                    </p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-progress-bar"></div>
                </div>

                <p className="text-xs text-gray-400 italic">
                    Mengarahkan Anda kembali ke halaman Login dalam 3 detik... 
                </p>

                <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Kembali Sekarang
                </button>
            </div>

            {/*  style internal untuk animasi progress bar sederhana */}
            <style jsx>{`
                @keyframes progress-bar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress-bar {
                    animation: progress-bar 3s linear;
                }
            `}</style>
        </AuthFromWrapper>
    );
};

export default NotAuthorizedPage;