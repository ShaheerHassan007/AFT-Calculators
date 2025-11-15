
import React, { useState, useEffect } from 'react';
import type { Page } from '../App';
import type { HistoryEntry } from '../types';

const EventDetail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-sm">
        <span className="text-gray-400">{label}: </span>
        <span className="font-semibold text-gray-200">{value}</span>
    </div>
);

const HistoryCard: React.FC<{ entry: HistoryEntry; onDelete: (id: number) => void; }> = ({ entry, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-800/50 border border-yellow-700/20 rounded-lg overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center cursor-pointer gap-2" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex-shrink-0">
                    <p className="font-oswald text-lg text-gray-200">{entry.date}</p>
                    <p className="text-sm text-gray-400">{entry.scoreTitle}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className={`text-4xl font-bold font-oswald ${entry.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                        {entry.score}
                        <span className="text-xl ml-2 uppercase">
                            {entry.status}
                            {entry.altStatus && ` (${entry.altStatus})`}
                        </span>
                    </p>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-700/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 pt-4 mb-4">
                        <EventDetail label="Age" value={entry.age} />
                        <EventDetail label="Standard" value={entry.standard === 'M' ? 'Male' : entry.standard === 'F' ? 'Female' : 'Combat'} />
                        <EventDetail label="MDL" value={`${entry.eventValues.MDL} lbs`} />
                        <EventDetail label="HRP" value={`${entry.eventValues.HRP} reps`} />
                        <EventDetail label="SDC" value={formatTime(entry.eventValues.SDC)} />
                        <EventDetail label="Plank" value={formatTime(entry.eventValues.PLK)} />
                        {entry.activeAerobic === '2MR' ? (
                            <EventDetail label="2MR" value={formatTime(entry.eventValues['2MR'])} />
                        ) : (
                            <>
                                <EventDetail label="Alt Event" value={entry.altEvent} />
                                <EventDetail label="Alt Time" value={formatTime(entry.altEventTime)} />
                            </>
                        )}
                    </div>
                     <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }} className="w-full text-center p-2 bg-red-800/50 border border-red-500/30 text-red-300 rounded-md hover:bg-red-700/70 text-sm transition-all">
                        Delete Entry
                    </button>
                </div>
            )}
        </div>
    );
};


const HistoryPage: React.FC<{ navigateTo: (page: Page) => void; }> = ({ navigateTo }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        try {
            const storedHistory = JSON.parse(localStorage.getItem('aftHistory') || '[]');
            setHistory(storedHistory);
        } catch (error) {
            console.error("Failed to load score history:", error);
            setHistory([]);
        }
    }, []);

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to delete all saved scores? This action cannot be undone.")) {
            localStorage.removeItem('aftHistory');
            setHistory([]);
        }
    };
    
    const handleDeleteEntry = (id: number) => {
        const updatedHistory = history.filter(entry => entry.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem('aftHistory', JSON.stringify(updatedHistory));
    };

    return (
        <div className="p-4 text-gray-200 max-w-4xl mx-auto min-h-screen">
            <button onClick={() => navigateTo('home')} className="font-oswald mb-4 text-yellow-500 hover:text-yellow-400 transition-colors">
                &larr; Back to Home
            </button>
             <div className="flex justify-between items-center mb-8">
                <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-500 uppercase tracking-widest">
                    Score History
                </h1>
                {history.length > 0 && (
                    <button onClick={handleClearHistory} className="font-oswald p-2 px-4 bg-red-900/80 text-red-300 border border-red-700/50 rounded-md uppercase tracking-wider text-sm transition-colors hover:bg-red-800 flex-shrink-0">
                        Clear All
                    </button>
                )}
            </div>
            
            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map(entry => (
                        <HistoryCard key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 px-4 bg-gray-800/50 border border-yellow-700/20 rounded-lg mt-8">
                     <p className="text-gray-400 text-xl">No scores have been saved yet.</p>
                     <p className="text-gray-500 mt-2">Use the AFT Calculator and click "Save Score" to see your history here.</p>
                 </div>
            )}
        </div>
    );
};

export default HistoryPage;
