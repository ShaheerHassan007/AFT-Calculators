
import React, { useState, useMemo, useCallback } from 'react';
import { scoreData } from '../constants';
import type { EventKey, Standard, AltEvent, Results, HistoryEntry } from '../types';
import type { Page } from '../App';
import { Header } from '../components/Header';
import { EventControl } from '../components/EventControl';
import { AerobicSection } from '../components/AerobicSection';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { ICONS } from '../components/Icons';

interface CalculatorPageProps {
    navigateTo: (page: Page) => void;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({ navigateTo }) => {
    const [standard, setStandard] = useState<Standard>('M');
    const [age, setAge] = useState<number>(24);
    const [eventValues, setEventValues] = useState({
        MDL: 140, // lbs
        HRP: 10,  // reps
        SDC: 180, // seconds
        PLK: 90,  // seconds
        '2MR': 1320, // seconds
    });
    const [activeAerobic, setActiveAerobic] = useState<'2MR' | 'ALT'>('2MR');
    const [altEvent, setAltEvent] = useState<AltEvent>('walk');
    const [altEventTime, setAltEventTime] = useState(1800); // 30 mins in seconds
    const [results, setResults] = useState<Results | null>(null);
    const [lastSavedId, setLastSavedId] = useState<number | null>(null);

    const getAgeGroupKey = useCallback((age: number): string => {
        if (age <= 21) return "17-21";
        if (age <= 26) return "22-26";
        if (age <= 31) return "27-31";
        if (age <= 36) return "32-36";
        if (age <= 41) return "37-41";
        if (age <= 46) return "42-46";
        if (age <= 51) return "47-51";
        if (age <= 56) return "52-56";
        if (age <= 61) return "57-61";
        return "Over 62";
    }, []);

    const getScore = useCallback((event: EventKey, userValue: number, higherIsBetter: boolean): number => {
        const standardForScoring = standard === 'C' ? 'M' : standard;
        const ageGroup = getAgeGroupKey(age);
        const eventScoreData = scoreData[event] as any;
        
        if (!eventScoreData?.[ageGroup]?.[standardForScoring]) return 0;

        const scoreTable = eventScoreData[ageGroup][standardForScoring];
        const sortedPoints = Object.keys(scoreTable).map(Number).sort((a, b) => b - a);

        for (const points of sortedPoints) {
            const requiredValue = scoreTable[points];
            if (higherIsBetter ? userValue >= requiredValue : userValue <= requiredValue) {
                return points;
            }
        }
        return 0;
    }, [age, standard, getAgeGroupKey]);

    const eventPoints = useMemo(() => ({
        MDL: getScore('MDL', eventValues.MDL, true),
        HRP: getScore('HRP', eventValues.HRP, true),
        SDC: getScore('SDC', eventValues.SDC, false),
        PLK: getScore('PLK', eventValues.PLK, true),
        '2MR': getScore('2MR', eventValues['2MR'], false),
    }), [eventValues, getScore]);

    const handleEventChange = (event: EventKey, value: number) => {
        setEventValues(prev => ({ ...prev, [event]: value }));
        setResults(null);
        setLastSavedId(null);
    };

    const handleCalculate = () => {
        const resultId = Date.now();
        const minPointsPerEvent = 60;
        const minTotalScore = standard === 'C' ? 350 : 300;

        const coreEventsPoints = [eventPoints.MDL, eventPoints.HRP, eventPoints.SDC, eventPoints.PLK];
        let overallPassed = coreEventsPoints.every(p => p >= minPointsPerEvent);
        const fiveEventScore = coreEventsPoints.reduce((a, b) => a + b, 0);

        if (activeAerobic === '2MR') {
            const twoMrPoints = eventPoints['2MR'];
            if (twoMrPoints < minPointsPerEvent) {
                overallPassed = false;
            }
            const totalScore = fiveEventScore + twoMrPoints;
            if (totalScore < minTotalScore) {
                overallPassed = false;
            }
            setResults({
                id: resultId,
                score: totalScore,
                status: overallPassed ? 'Pass' : 'Fail',
                scoreTitle: 'Total Score',
                altStatus: null
            });
        } else {
            const ageGroup = getAgeGroupKey(age);
            const standardForScoring = standard === 'C' ? 'M' : standard;
            const requiredTime = scoreData.ALT[altEvent]?.[ageGroup]?.[standardForScoring];
            
            const altEventGo = requiredTime !== undefined && altEventTime <= requiredTime;
            if (!altEventGo) {
                overallPassed = false;
            }

            setResults({
                id: resultId,
                score: fiveEventScore,
                status: overallPassed ? 'Pass' : 'Fail',
                scoreTitle: '5-Event Score',
                altStatus: altEventGo ? 'Go' : 'No-Go'
            });
        }
    };

    const handleSaveScore = () => {
        if (!results) return;
    
        const newEntry: HistoryEntry = {
            id: results.id,
            date: new Date().toLocaleDateString(),
            score: results.score,
            scoreTitle: results.scoreTitle,
            status: results.status,
            altStatus: results.altStatus,
            age,
            standard,
            eventValues,
            activeAerobic,
            altEvent,
            altEventTime,
        };
        
        try {
            const history: HistoryEntry[] = JSON.parse(localStorage.getItem('aftHistory') || '[]');
            history.unshift(newEntry);
            localStorage.setItem('aftHistory', JSON.stringify(history));
            setLastSavedId(results.id);
        } catch (error) {
            console.error("Failed to save score history:", error);
        }
    };
    
    const handleClear = () => {
        setStandard('M');
        setAge(24);
        setEventValues({
            MDL: 80,
            HRP: 4,
            SDC: 180,
            PLK: 90,
            '2MR': 1320,
        });
        setActiveAerobic('2MR');
        setAltEvent('walk');
        setAltEventTime(1800);
        setResults(null);
        setLastSavedId(null);
    };

    return (
        <div className="p-2 sm:p-5 font-sans">
            <button onClick={() => navigateTo('home')} className="font-oswald mb-4 text-yellow-500 hover:text-yellow-400 transition-colors">
                &larr; Back to Home
            </button>
            <div className="max-w-4xl mx-auto">
                <Header 
                    standard={standard}
                    onStandardChange={(e) => {
                        setStandard(e.target.value as Standard);
                        setResults(null);
                        setLastSavedId(null);
                    }}
                    age={age}
                    onAgeChange={(e) => {
                        setAge(parseInt(e.target.value));
                        setResults(null);
                        setLastSavedId(null);
                    }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <EventControl
                        title="Max Deadlift"
                        points={eventPoints.MDL}
                        icon={ICONS.MDL}
                        value={eventValues.MDL}
                        onValueChange={(v) => handleEventChange('MDL', v)}
                        min={80} max={350} step={10}
                        unit="lbs"
                        inputType="number"
                    />
                    <EventControl
                        title="Hand Release Push-Up"
                        points={eventPoints.HRP}
                        icon={ICONS.HRP}
                        value={eventValues.HRP}
                        onValueChange={(v) => handleEventChange('HRP', v)}
                        min={4} max={62} step={1}
                        unit="reps"
                        inputType="number"
                    />
                    <EventControl
                        title="Sprint Drag Carry"
                        points={eventPoints.SDC}
                        icon={ICONS.SDC}
                        value={eventValues.SDC}
                        onValueChange={(v) => handleEventChange('SDC', v)}
                        min={89} max={350} step={1}
                        unit={['m', 's']}
                        inputType="time"
                    />
                    <EventControl
                        title="Plank"
                        points={eventPoints.PLK}
                        icon={ICONS.PLK}
                        value={eventValues.PLK}
                        onValueChange={(v) => handleEventChange('PLK', v)}
                        min={28} max={220} step={1}
                        unit={['min', 's']}
                        inputType="time"
                    />
                </div>

                <AerobicSection
                    activeAerobic={activeAerobic}
                    setActiveAerobic={(type) => {
                        setActiveAerobic(type);
                        setResults(null);
                        setLastSavedId(null);
                    }}
                    twoMrPoints={eventPoints['2MR']}
                    twoMrValue={eventValues['2MR']}
                    onTwoMrChange={(v) => handleEventChange('2MR', v)}
                    altEvent={altEvent}
                    setAltEvent={(e) => {
                        setAltEvent(e.target.value as AltEvent);
                        setResults(null);
                        setLastSavedId(null);
                    }}
                    altEventTime={altEventTime}
                    setAltEventTime={(v) => {
                        setAltEventTime(v);
                        setResults(null);
                        setLastSavedId(null);
                    }}
                />

                <ResultsDisplay
                    results={results}
                    onCalculate={handleCalculate}
                    onClear={handleClear}
                    onSave={handleSaveScore}
                    isSaved={!!results && results.id === lastSavedId}
                />
            </div>
        </div>
    );
};

export default CalculatorPage;