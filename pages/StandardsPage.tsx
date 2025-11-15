import React from 'react';
import type { Page } from '../App';
import { StandardsData } from '../components/StandardsData';

interface StandardsPageProps {
    navigateTo: (page: Page) => void;
}

const StandardsPage: React.FC<StandardsPageProps> = ({ navigateTo }) => {
    return (
        <div className="p-4 text-gray-200">
            <button onClick={() => navigateTo('home')} className="font-oswald mb-4 text-yellow-500 hover:text-yellow-400 transition-colors">
                &larr; Back to Home
            </button>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-yellow-500 uppercase tracking-widest mb-8 text-center">
                AFT Standards
            </h1>
            <StandardsData />
        </div>
    );
};

export default StandardsPage;