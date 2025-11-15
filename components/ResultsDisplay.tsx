
import React from 'react';
import type { Results } from '../types';

interface ResultsDisplayProps {
    results: Results | null;
    onCalculate: () => void;
    onClear: () => void;
    onSave: () => void;
    isSaved: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onCalculate, onClear, onSave, isSaved }) => {
    return (
        <div className="bg-gray-800/50 border border-yellow-700/20 rounded-md p-6">
            {results && (
                 <div className="bg-gray-900/50 p-5 border border-gray-700 rounded-md grid grid-cols-1 sm:grid-cols-2 text-center gap-4 mb-5">
                    <div>
                        <h3 className="text-gray-400 text-base font-oswald uppercase tracking-wider mb-1">{results.scoreTitle}</h3>
                        <span className="text-5xl font-bold font-mono text-gray-100">{results.score}</span>
                    </div>
                    <div>
                        <h3 className="text-gray-400 text-base font-oswald uppercase tracking-wider mb-1">Overall Status</h3>
                        <span className={`text-5xl font-bold font-oswald uppercase ${results.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                            {results.status}
                            {results.altStatus && <span className="text-2xl ml-2">({results.altStatus})</span>}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={onCalculate} 
                    className="w-full p-4 text-lg font-bold bg-yellow-600 text-gray-900 border border-yellow-600 rounded-md uppercase font-oswald tracking-wider transition-colors hover:bg-yellow-500">
                    Calculate
                </button>
                <button 
                    onClick={onSave}
                    disabled={!results || isSaved}
                    className="w-full p-4 text-lg font-bold bg-blue-600 text-gray-100 border border-blue-600 rounded-md uppercase font-oswald tracking-wider transition-colors hover:bg-blue-500 disabled:bg-gray-500 disabled:text-gray-300 disabled:border-gray-500 disabled:cursor-not-allowed">
                    {isSaved ? 'Saved' : 'Save Score'}
                </button>
                <button 
                    onClick={onClear} 
                    className="w-full p-4 text-lg font-bold bg-transparent text-gray-400 border border-gray-600 rounded-md uppercase font-oswald tracking-wider transition-colors hover:bg-gray-700 hover:text-gray-200">
                    Clear
                </button>
            </div>
        </div>
    );
};