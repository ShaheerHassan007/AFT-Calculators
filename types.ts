
export type EventKey = 'MDL' | 'HRP' | 'SDC' | 'PLK' | '2MR';
export type Standard = 'M' | 'F' | 'C';
export type AltEvent = 'walk' | 'bike' | 'swim' | 'row';

export interface Results {
    id: number;
    score: number;
    status: 'Pass' | 'Fail';
    scoreTitle: string;
    altStatus: 'Go' | 'No-Go' | null;
}

export interface HistoryEntry {
    id: number;
    date: string;
    score: number;
    scoreTitle: string;
    status: 'Pass' | 'Fail';
    altStatus: 'Go' | 'No-Go' | null;
    age: number;
    standard: Standard;
    eventValues: {
        MDL: number;
        HRP: number;
        SDC: number;
        PLK: number;
        '2MR': number;
    };
    activeAerobic: '2MR' | 'ALT';
    altEvent: AltEvent;
    altEventTime: number;
}

// Interfaces for scoreData structure
type ScoreTable = { [points: number]: number };
type GenderScores = { M: ScoreTable; F: ScoreTable };
type AgeGroupScores = { [ageGroup: string]: GenderScores };
export type EventScores = { [key in EventKey]?: AgeGroupScores };

type AltEventTime = { [gender in 'M' | 'F']: number };
type AltEventAgeGroup = { [ageGroup: string]: AltEventTime };
type AltEventData = { [key in AltEvent]: AltEventAgeGroup };

export interface ScoreData extends EventScores {
    ALT: AltEventData;
}