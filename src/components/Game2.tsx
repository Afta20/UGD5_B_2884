'use client';
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Game2 = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);

    // Menggunakan useEffect untuk memantau level berdasarkan skor 
    useEffect(() => {
        if (score > 0 && score % 10 === 0) {
            setLevel(prev => prev + 1);
        }
    }, [score]);

    const handleClick = () => {
        setScore(prev => {
            const nextScore = prev + 1;
            if (nextScore % 10 === 0) {
                toast.success(`Level naik! Sekarang level ${level + 1}`);
            } else {
                toast.info(`Skor bertambah: ${nextScore}`);
            }
            return nextScore;
        });
    };

    const handleReset = () => {
        setScore(0);
        setLevel(1);
        toast.warn('Game di-reset. Ayo mulai lagi!');
    };

    return (
        <div className="bg-orange-100 p-6 rounded-2xl shadow-md flex flex-col items-center border-2 border-orange-400 w-full">
            <h2 className="text-xl font-bold mb-1 text-orange-700">Bonus Clicker</h2>
            <div className="flex gap-4 mb-4">
                <p className="text-sm font-semibold text-orange-600">Skor: {score}</p>
                <p className="text-sm font-semibold text-orange-600">Level: {level}</p>
            </div>
            
            <button 
                onClick={handleClick}
                className="bg-orange-500 hover:bg-orange-600 text-white w-24 h-24 rounded-full shadow-lg active:scale-90 transition-all flex items-center justify-center text-xl font-bold border-4 border-orange-200"
            >
                KLIK!
            </button>

            <button 
                onClick={handleReset}
                className="mt-4 text-xs text-orange-700 underline"
            >
                Reset Game
            </button>

            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default Game2;