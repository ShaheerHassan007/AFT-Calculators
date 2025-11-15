import React, { useState, useEffect, useCallback } from 'react';
import type { Page } from '../App';

const IN_TO_CM = 2.54;

const maxBodyFatData = {
    'M': { '17-20': 20, '21-27': 22, '28-39': 24, '40+': 26 },
    'F': { '17-20': 30, '21-27': 32, '28-39': 34, '40+': 36 }
};

type Gender = 'M' | 'F';
type AgeGroup = '17-20' | '21-27' | '28-39' | '40+';
type Unit = 'in' | 'cm';
type Results = { bf: number; max: number; status: 'Pass' | 'Fail'; message?: string };

interface MeasurementInputProps {
    label: string;
    value: number;
    unit: Unit;
    onValueChange: (v: number) => void;
    onUnitChange: (u: Unit) => void;
    minIn: number;
    maxIn: number;
    step?: number;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({ label, value, unit, onValueChange, onUnitChange, minIn, maxIn, step = 0.5 }) => {
    const isMetric = unit === 'cm';
    const min = isMetric ? (minIn * IN_TO_CM) : minIn;
    const max = isMetric ? (maxIn * IN_TO_CM) : maxIn;

    return (
        <div>
            <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="number"
                    value={value}
                    onChange={e => onValueChange(parseFloat(e.target.value) || 0)}
                    step={step}
                    className="bg-gray-700 border border-gray-600 rounded-md p-3 text-lg font-mono text-center w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
                <select
                    value={unit}
                    onChange={e => onUnitChange(e.target.value as Unit)}
                    className="bg-gray-700 border border-gray-600 rounded-md p-3 text-base text-gray-200 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.65em auto', paddingRight: '2rem' }}
                >
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                </select>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onValueChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 border border-gray-600 rounded-sm outline-none cursor-pointer mt-auto accent-[#D4AF37]"
            />
        </div>
    );
};


const ArmyBodyFatCalculatorPage: React.FC<{ navigateTo: (page: Page) => void; }> = ({ navigateTo }) => {
    const [gender, setGender] = useState<Gender>('M');
    const [ageGroup, setAgeGroup] = useState<AgeGroup>('21-27');
    
    const [height, setHeight] = useState(68.5);
    const [heightUnit, setHeightUnit] = useState<Unit>('in');
    const [neck, setNeck] = useState(15.5);
    const [neckUnit, setNeckUnit] = useState<Unit>('in');
    const [waist, setWaist] = useState(34);
    const [waistUnit, setWaistUnit] = useState<Unit>('in');
    const [hip, setHip] = useState(38.5);
    const [hipUnit, setHipUnit] = useState<Unit>('in');

    const [results, setResults] = useState<Results | null>(null);

    const handleUnitChange = (setter: (u: Unit) => void, value: number, valSetter: (v: number) => void, newUnit: Unit) => {
        const isNowMetric = newUnit === 'cm';
        const convertedValue = isNowMetric ? value * IN_TO_CM : value / IN_TO_CM;
        valSetter(parseFloat(convertedValue.toFixed(1)));
        setter(newUnit);
        setResults(null);
    };

    const getValueInInches = (value: number, unit: Unit) => (unit === 'cm' ? value / IN_TO_CM : value);

    const calculate = () => {
        const heightIn = getValueInInches(height, heightUnit);
        const neckIn = getValueInInches(neck, neckUnit);
        const waistIn = getValueInInches(waist, waistUnit);
        const hipIn = getValueInInches(hip, hipUnit);

        if (!heightIn || !neckIn || !waistIn || (gender === 'F' && !hipIn)) {
            setResults({ bf: 0, max: 0, status: 'Fail', message: 'Fill All Fields' });
            return;
        }

        let bodyFat = 0;
        if (gender === 'M') {
            const circumference = waistIn - neckIn;
            if (circumference <= 0) {
                 setResults({ bf: 0, max: 0, status: 'Fail', message: 'Abdomen > Neck' });
                 return;
            }
            bodyFat = (86.010 * Math.log10(circumference)) - (70.041 * Math.log10(heightIn)) + 36.76;
        } else { // Female
            const circumference = waistIn + hipIn - neckIn;
             if (circumference <= 0) {
                 setResults({ bf: 0, max: 0, status: 'Fail', message: 'Invalid Values' });
                 return;
            }
            bodyFat = (163.205 * Math.log10(circumference)) - (97.684 * Math.log10(heightIn)) - 78.387;
        }

        const finalBodyFat = Math.floor(bodyFat);
        
        if (isNaN(finalBodyFat) || finalBodyFat < 0) {
            setResults({ bf: 0, max: 0, status: 'Fail', message: 'Calc Error' });
            return;
        }

        const maxAllowable = maxBodyFatData[gender][ageGroup];
        const isPassing = finalBodyFat <= maxAllowable;

        setResults({
            bf: finalBodyFat,
            max: maxAllowable,
            status: isPassing ? 'Pass' : 'Fail'
        });
    };
    
    const clear = () => {
        setGender('M');
        setAgeGroup('21-27');
        setHeight(68.5); setHeightUnit('in');
        setNeck(15.5); setNeckUnit('in');
        setWaist(34); setWaistUnit('in');
        setHip(38.5); setHipUnit('in');
        setResults(null);
    };
    
    useEffect(() => {
        setResults(null);
    }, [gender, ageGroup]);

    return (
        <div className="p-2 sm:p-5 font-sans">
            <button onClick={() => navigateTo('home')} className="font-oswald mb-4 text-yellow-500 hover:text-yellow-400 transition-colors">
                &larr; Back to Home
            </button>
            <div className="max-w-4xl mx-auto">
                 <div className="bg-gray-800/50 border border-yellow-700/30 rounded-md p-6 mb-5 text-center">
                    <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-yellow-500 uppercase tracking-widest">Army Body Fat Calculator</h1>
                    <p className="text-sm text-gray-400 mt-2 mb-6 max-w-lg mx-auto">Calculate your body fat percentage using the U.S. Army multi-site tape method (AR 600-9).</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div>
                            <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value as Gender)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                         <div>
                            <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">Age Group</label>
                            <select value={ageGroup} onChange={e => setAgeGroup(e.target.value as AgeGroup)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                                <option value="17-20">17-20</option>
                                <option value="21-27">21-27</option>
                                <option value="28-39">28-39</option>
                                <option value="40+">40+</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-yellow-700/20 rounded-md p-6 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MeasurementInput label="Height" value={height} unit={heightUnit} onValueChange={setHeight} onUnitChange={(u) => handleUnitChange(setHeightUnit, height, setHeight, u)} minIn={40} maxIn={96} />
                        <MeasurementInput label="Neck" value={neck} unit={neckUnit} onValueChange={setNeck} onUnitChange={(u) => handleUnitChange(setNeckUnit, neck, setNeck, u)} minIn={10} maxIn={25} />
                        <MeasurementInput label={gender === 'F' ? 'Waist' : 'Abdomen'} value={waist} unit={waistUnit} onValueChange={setWaist} onUnitChange={(u) => handleUnitChange(setWaistUnit, waist, setWaist, u)} minIn={20} maxIn={60} />
                        {gender === 'F' && <MeasurementInput label="Hip" value={hip} unit={hipUnit} onValueChange={setHip} onUnitChange={(u) => handleUnitChange(setHipUnit, hip, setHip, u)} minIn={25} maxIn={65} />}
                    </div>
                </div>
                
                <div className="bg-gray-800/50 border border-yellow-700/20 rounded-md p-6">
                    {results && (
                        <div className="bg-gray-900/50 p-5 border border-gray-700 rounded-md grid grid-cols-1 sm:grid-cols-3 text-center gap-4 mb-5">
                            <div>
                                <h3 className="text-gray-400 text-base font-oswald uppercase tracking-wider mb-1">Body Fat %</h3>
                                <span className="text-5xl font-bold font-mono text-gray-100">{results.message ? '--' : `${results.bf}%`}</span>
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-base font-oswald uppercase tracking-wider mb-1">Max Allowable %</h3>
                                <span className="text-5xl font-bold font-mono text-gray-100">{results.message ? '--' : `${results.max}%`}</span>
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-base font-oswald uppercase tracking-wider mb-1">Status</h3>
                                <span className={`text-5xl font-bold font-oswald uppercase ${results.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                                    {results.message || results.status}
                                </span>
                            </div>
                        </div>
                    )}
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={calculate} className="w-full p-4 text-lg font-bold bg-yellow-600 text-gray-900 border border-yellow-600 rounded-md uppercase font-oswald tracking-wider transition-colors hover:bg-yellow-500">
                            Calculate
                        </button>
                        <button onClick={clear} className="w-full p-4 text-lg font-bold bg-transparent text-gray-400 border border-gray-600 rounded-md uppercase font-oswald tracking-wider transition-colors hover:bg-gray-700 hover:text-gray-200">
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArmyBodyFatCalculatorPage;
