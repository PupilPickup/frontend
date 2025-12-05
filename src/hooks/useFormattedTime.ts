import { useTimeFormat } from '../context/TimeFormatContext';
import { convertTo12Hour } from '../utils/timeUtils';

export const useFormattedTime = () => {
    const { timeFormat } = useTimeFormat();
    
    const formatTime = (time24h: string): string => {
        if (!time24h) return '';
        
        // Remove seconds if any (from “08:30:00” to “08:30”)
        const timeWithoutSeconds = time24h.split(':').slice(0, 2).join(':');
        
        // Convert according to global format
        return timeFormat === '12' 
            ? convertTo12Hour(timeWithoutSeconds) 
            : timeWithoutSeconds;
    };
    
    return { formatTime, timeFormat };
};