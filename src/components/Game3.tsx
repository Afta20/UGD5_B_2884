'use client';
import React, { useState, useEffect } from "react";

const COLORS = [
    { name: 'Merah', hex: '#EF4444' },
    { name: 'Biru', hex: '#3B82F6' },
    { name: 'Hijau', hex: '#22C55E' },
    { name: 'Kuning', hex: '#EAB308' }
];

const Game3 = () => {
    const [target, setTarget] = useState(COLORS[0]);
    const [displayColor, setDisplayColor] = useState(COLORS[1].hex);
    const [score, setScore] = useState(0);

    const generateRound = () => {
        const randomTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomDisplay = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
        setTarget(randomTarget);
        setDisplayColor(randomDisplay);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleGuess = (hex: string) => {
        if (hex === target.hex) {
            setScore(prev => prev + 1);
        } else {
            setScore(Math.max(0, score - 1));
        }
        generateRound();
    };

    return (
        <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-400 w-full text-center">
            <h2 className="text-xl font-bold text-purple-700 mb-2">Color Match</h2>
            <p className="text-xs text-gray-500 mb-4">Pilih warna yang sesuai dengan **Teks**!</p>
            
            <div className="mb-6 p-4 bg-white rounded-xl shadow-inner">
                <span 
                    className="text-3xl font-black uppercase tracking-widest"
                    style={{ color: displayColor }}
                >
                    {target.name}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {COLORS.map((c) => (
                    <button
                        key={c.hex}
                        onClick={() => handleGuess(c.hex)}
                        className="h-12 rounded-lg shadow-sm active:scale-90 transition-all border-2 border-white"
                        style={{ backgroundColor: c.hex }}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-bold">Skor: {score}</span>
                <button onClick={() => setScore(0)} className="text-[10px] underline">Reset</button>
            </div>
        </div>
    );
};

export default Game3;