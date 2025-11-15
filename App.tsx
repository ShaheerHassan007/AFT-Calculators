import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import StandardsPage from './pages/StandardsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import HistoryPage from './pages/HistoryPage';
import ArmyBodyFatCalculatorPage from './pages/ArmyBodyFatCalculatorPage';

export type Page = 'home' | 'calculator' | 'standards' | 'height-weight' | 'other' | 'history';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');

    const renderPage = () => {
        switch (page) {
            case 'calculator':
                return <CalculatorPage navigateTo={setPage} />;
            case 'standards':
                return <StandardsPage navigateTo={setPage} />;
            case 'height-weight':
                return <ArmyBodyFatCalculatorPage navigateTo={setPage} />;
            case 'other':
                return <PlaceholderPage title="Other Calculators" navigateTo={setPage} />;
            case 'history':
                return <HistoryPage navigateTo={setPage} />;
            case 'home':
            default:
                return <HomePage navigateTo={setPage} />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
            {renderPage()}
        </div>
    );
};

export default App;