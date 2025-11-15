import React, { useState, useEffect } from 'react';

interface EventControlProps {
    title: string;
    points: number;
    icon: React.ReactNode;
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    unit: string | [string, string];
    inputType: 'number' | 'time';
    isCard?: boolean;
}

export const EventControl: React.FC<EventControlProps> = ({
    title,
    points,
    icon,
    value,
    onValueChange,
    min,
    max,
    step,
    unit,
    inputType,
    isCard = true
}) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (inputType === 'time') {
            setMinutes(Math.floor(value / 60));
            setSeconds(value % 60);
        }
    }, [value, inputType]);

    const handleTimeChange = (newMinutes: number, newSeconds: number) => {
        onValueChange((newMinutes * 60) + newSeconds);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = parseInt(e.target.value) || 0;
        setMinutes(newMin);
        handleTimeChange(newMin, seconds);
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newSec = parseInt(e.target.value) || 0;
        if (newSec > 59) newSec = 59;
        if (newSec < 0) newSec = 0;
        setSeconds(newSec);
        handleTimeChange(minutes, newSec);
    };
    
    const containerClasses = isCard 
        ? "bg-gray-800/50 border border-yellow-700/20 rounded-md p-5 flex flex-col h-full" 
        : "flex flex-col";

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-oswald text-xl font-semibold uppercase tracking-wider text-gray-200">{title}</h3>
                <div className="text-right leading-none">
                    <span className="text-4xl font-bold text-gray-100">{points}</span>
                    <p className="text-xs text-gray-400 tracking-widest">POINTS</p>
                </div>
            </div>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 text-gray-400 flex-shrink-0">{icon}</div>
                <div className="flex items-center gap-2 flex-grow">
                    {inputType === 'number' ? (
                        <>
                            <input 
                                type="number"
                                value={value}
                                onChange={(e) => onValueChange(parseInt(e.target.value))}
                                min={min}
                                max={max}
                                step={step}
                                className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <span className="text-sm text-gray-400 uppercase">{unit}</span>
                        </>
                    ) : (
                        <>
                            <input 
                                type="number" 
                                value={minutes}
                                onChange={handleMinutesChange}
                                className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <span className="text-sm text-gray-400 uppercase">{Array.isArray(unit) && unit[0]}</span>
                            <input 
                                type="number" 
                                value={seconds.toString().padStart(2, '0')}
                                onChange={handleSecondsChange}
                                max="59"
                                min="0"
                                className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <span className="text-sm text-gray-400 uppercase">{Array.isArray(unit) && unit[1]}</span>
                        </>
                    )}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onValueChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 border border-gray-600 rounded-sm outline-none cursor-pointer mt-auto accent-[#D4AF37]"
            />
        </div>
    );
};