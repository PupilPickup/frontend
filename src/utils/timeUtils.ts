export const convertTo24Hour = (time12h: string): string => {
    if (!time12h) return '';
    
    //  If it is already in 24-hour format, return as is.
    if (!time12h.includes('AM') && !time12h.includes('PM')) {
        return time12h;
    }

    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

export const convertTo12Hour = (time24h: string): string => {
    if (!time24h) return '';
    
    // If it already has AM/PM, return as is.
    if (time24h.includes('AM') || time24h.includes('PM')) {
        return time24h;
    }
    
    const [hours, minutes] = time24h.split(':');
    let hour = parseInt(hours);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12;
    }
    
    return `${hour}:${minutes} ${period}`;
};