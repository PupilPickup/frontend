import React from 'react';
import { useTimeFormat } from '../../context/TimeFormatContext';

const TimeFormatToggle: React.FC = () => {
    const { timeFormat, toggleTimeFormat } = useTimeFormat();
    
    return (
        //<div className="flex items-center justify-end mb-3">
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={timeFormat === '24'}
                        onChange={toggleTimeFormat}
                        className="sr-only"
                    />
                    <div className="block w-10 h-6 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                    <div
                        className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition bg-gray-500 dark:bg-[#3498DB] ${
                            timeFormat === '24' ? "translate-x-4" : "translate-x-0"
                        }`}
                    ></div>
                </div>
                <span className="ml-3 text-sm dark:text-white">
                    {timeFormat === '12' ? '12h' : '24h'}
                </span>
            </label>
       //</div>
    );
};

export default TimeFormatToggle;