import React from 'react';
import type { AltEvent } from '../types';
import { EventControl } from './EventControl';
import { ICONS } from './Icons';

interface AerobicSectionProps {
    activeAerobic: '2MR' | 'ALT';
    setActiveAerobic: (type: '2MR' | 'ALT') => void;
    twoMrPoints: number;
    twoMrValue: number;
    onTwoMrChange: (value: number) => void;
    altEvent: AltEvent;
    setAltEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    altEventTime: number;
    setAltEventTime: (value: number) => void;
}

const TimeInput: React.FC<{ value: number; onChange: (value: number) => void; }> = ({ value, onChange }) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange((parseInt(e.target.value) || 0) * 60 + seconds);
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newSec = parseInt(e.target.value) || 0;
        if (newSec > 59) newSec = 59;
        onChange(minutes * 60 + newSec);
    };

    return (
        <div className="flex items-center gap-2">
             <input type="number" value={minutes} onChange={handleMinutesChange} min="0" className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
            <span className="text-sm text-gray-400 uppercase">min</span>
            <input type="number" value={seconds.toString().padStart(2, '0')} onChange={handleSecondsChange} min="0" max="59" className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
            <span className="text-sm text-gray-400 uppercase">s</span>
        </div>
    );
}

export const AerobicSection: React.FC<AerobicSectionProps> = (props) => {
    return (
        <div className="bg-gray-800/50 border border-yellow-700/20 rounded-md p-6 mb-5">
            <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button 
                    onClick={() => props.setActiveAerobic('2MR')}
                    className={`p-3 text-sm sm:text-base font-oswald border rounded-md uppercase tracking-wider transition-colors ${props.activeAerobic === '2MR' ? 'bg-yellow-600 text-gray-900 border-yellow-600' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}`}
                >
                    2-Mile Run
                </button>
                <button 
                    onClick={() => props.setActiveAerobic('ALT')}
                    className={`p-3 text-sm sm:text-base font-oswald border rounded-md uppercase tracking-wider transition-colors ${props.activeAerobic === 'ALT' ? 'bg-yellow-600 text-gray-900 border-yellow-600' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}`}
                >
                    Alternate Events
                </button>
            </div>

            {props.activeAerobic === '2MR' && (
                <div className="border-t border-gray-700 pt-4">
                    <EventControl
                        isCard={false}
                        title="2-Mile Run (2MR)"
                        points={props.twoMrPoints}
                        icon={ICONS['2MR']}
                        value={props.twoMrValue}
                        onValueChange={props.onTwoMrChange}
                        min={802} max={1704} step={1}
                        unit={['min', 's']}
                        inputType="time"
                    />
                </div>
            )}
            {props.activeAerobic === 'ALT' && (
                <div className="border-t border-gray-700 pt-5">
                    <h3 className="font-oswald text-xl font-semibold uppercase tracking-wider text-gray-200 mb-4">Alternate Event (Go/No-Go)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">Event</label>
                            <select value={props.altEvent} onChange={props.setAltEvent} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" style={{backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.65em auto'}}>
                                <option value="walk">2.5-mile Walk</option>
                                <option value="bike">12km Bike</option>
                                <option value="swim">1km Swim</option>
                                <option value="row">5km Row</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">Your Time</label>
                            <TimeInput value={props.altEventTime} onChange={props.setAltEventTime} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
