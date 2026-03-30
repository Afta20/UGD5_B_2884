'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";
import Game2 from "../../components/Game2";
import Game3 from "../../components/Game3"; 
import { toast } from "react-toastify";
import { LogOut, ChevronLeft } from "lucide-react"; 

export default function Home() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (!loggedIn) {
            router.push('/auth/not-authorized');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#4A90E2] p-4 text-white">
            <div className="w-full max-w-md flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Selamat Datang!</h1>
                <button onClick={() => {localStorage.removeItem('isLoggedIn'); router.push('/auth/login');}} className="bg-red-500 p-2.5 rounded-xl shadow-lg">
                    <LogOut size={18} />
                </button>
            </div>

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center min-h-[500px] justify-center text-gray-800">
                {!selectedGame ? (
                    <div className="w-full text-center">
                        <h2 className="text-3xl font-black mb-10">Choose Your Game</h2>
                        <div className="flex flex-col gap-4">
                            <button onClick={() => setSelectedGame('game1')} className="bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-md">Game Utama</button>
                            <button onClick={() => setSelectedGame('game2')} className="bg-green-500 text-white font-bold py-4 rounded-2xl shadow-md">Game Bonus (Clicker)</button>
                            {/* Tombol Game 3 */}
                            <button onClick={() => setSelectedGame('game3')} className="bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-md transition-transform active:scale-95">Game Kreatif (Color Match)</button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full mb-6">
                            {selectedGame === 'game1' && <Game1 />}
                            {selectedGame === 'game2' && <Game2 />}
                            {selectedGame === 'game3' && <Game3 />}
                        </div>
                        <button onClick={() => setSelectedGame(null)} className="flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-xl font-bold text-sm">
                            <ChevronLeft size={16} /> Back to Selection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}