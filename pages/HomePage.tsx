import React from 'react';
import type { Page } from '../App';

interface HomePageProps {
    navigateTo: (page: Page) => void;
}

const NavButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full text-center p-2.5 bg-gray-800/70 border border-yellow-700/30 rounded-lg hover:bg-gray-700/90 hover:border-yellow-600/50 transition-all duration-300"
    >
        <span className="font-oswald text-lg uppercase tracking-wider text-yellow-500">{children}</span>
    </button>
);


const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-gray-200">
            <div className="text-center mb-6">
                <h1 className="font-orbitron font-bold text-yellow-500 uppercase leading-none">
                    <span className="block text-3xl md:text-4xl tracking-[0.2em] ml-[0.2em]">AFT</span>
                    <span className="block text-4xl md:text-5xl tracking-widest -mt-1">CALCULATOR</span>
                </h1>
                <p className="text-gray-400 mt-2 text-base">Calculate Your Army Fitness Test Score</p>
            </div>

            <div className="w-full max-w-md space-y-2">
                <NavButton onClick={() => navigateTo('calculator')}>AFT Calculator</NavButton>
                <NavButton onClick={() => navigateTo('standards')}>AFT Standards</NavButton>
                <NavButton onClick={() => navigateTo('height-weight')}>Army Body Fat Calculator</NavButton>
                <NavButton onClick={() => navigateTo('other')}>Other Calculators</NavButton>
                <NavButton onClick={() => navigateTo('history')}>AFT Score History</NavButton>
            </div>
        </div>
    );
};

export default HomePage;