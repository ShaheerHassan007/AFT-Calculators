import React from 'react';
import type { Standard } from '../types';

interface HeaderProps {
    standard: Standard;
    onStandardChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    age: number;
    onAgeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="font-oswald mb-1.5 block text-sm text-gray-400 uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const CustomSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select 
        {...props} 
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
        style={{
            backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '0.65em auto',
        }}
    >
        {props.children}
    </select>
);

export const Header: React.FC<HeaderProps> = ({ standard, onStandardChange, age, onAgeChange }) => {
    const ageOptions = Array.from({ length: (62 - 17) + 1 }, (_, i) => 17 + i);

    return (
        <div className="bg-gray-800/50 border border-yellow-700/30 rounded-md p-6 mb-5 text-center">
            <h1 className="font-orbitron text-4xl font-bold text-yellow-500 uppercase tracking-widest">AFT Calculator</h1>
            <p className="text-base text-gray-400 mt-2 mb-6 max-w-md mx-auto">Army Fitness Test Score Calculator</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <ControlGroup label="AFT Standard">
                    <CustomSelect value={standard} onChange={onStandardChange}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="C">Combat Arms</option>
                    </CustomSelect>
                </ControlGroup>
                <ControlGroup label="Age">
                    <CustomSelect value={age} onChange={onAgeChange}>
                        {ageOptions.map(ageVal => (
                            <option key={ageVal} value={ageVal}>{ageVal}</option>
                        ))}
                        <option value="63">62+</option>
                    </CustomSelect>
                </ControlGroup>
            </div>
        </div>
    );
};