import React from 'react';
import type { Page } from '../App';

interface PlaceholderPageProps {
    title: string;
    navigateTo: (page: Page) => void;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, navigateTo }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-yellow-500 uppercase tracking-widest mb-4">
                {title}
            </h1>
            <p className="text-gray-400 text-xl mb-8">
                This feature is coming soon.
            </p>
            <button
                onClick={() => navigateTo('home')}
                className="font-oswald p-3 px-6 bg-yellow-600 text-gray-900 border border-yellow-600 rounded-md uppercase tracking-wider transition-colors hover:bg-yellow-500"
            >
                &larr; Back to Home
            </button>
        </div>
    );
};

export default PlaceholderPage;
