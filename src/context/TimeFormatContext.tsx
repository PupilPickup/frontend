import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TimeFormat = '12' | '24';

interface TimeFormatContextType {
    timeFormat: TimeFormat;
    toggleTimeFormat: () => void;
    setTimeFormat: (format: TimeFormat) => void;
}

const TimeFormatContext = createContext<TimeFormatContextType | undefined>(undefined);

export const TimeFormatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Read from localStorage to persist preference
    const [timeFormat, setTimeFormatState] = useState<TimeFormat>(() => {
        const saved = localStorage.getItem('timeFormat');
        return (saved === '12' || saved === '24') ? saved : '24'; // Default 24h
    });

    // Save to localStorage when changing
    useEffect(() => {
        localStorage.setItem('timeFormat', timeFormat);
    }, [timeFormat]);

    const toggleTimeFormat = () => {
        setTimeFormatState(prev => prev === '12' ? '24' : '12');
    };

    const setTimeFormat = (format: TimeFormat) => {
        setTimeFormatState(format);
    };

    return (
        <TimeFormatContext.Provider value={{ timeFormat, toggleTimeFormat, setTimeFormat }}>
            {children}
        </TimeFormatContext.Provider>
    );
};

export const useTimeFormat = () => {
    const context = useContext(TimeFormatContext);
    if (!context) {
        throw new Error('useTimeFormat must be used within TimeFormatProvider');
    }
    return context;
};