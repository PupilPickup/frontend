
// Check if a field is empty
export function isFieldEmpty(field: string|number): boolean{
    return field === '';
}

// Check if a name is at least two alphabet characters long
export function isNameValid(name: string): boolean {
    // Allows letters, spaces, dashes, and periods
    const allowedPattern = /^[a-zA-Z\s.-]+$/;
    // At least 5 alphabetic characters
    const minAlphaPattern = /([a-zA-Z].*?){5,}/;

    return allowedPattern.test(name) && minAlphaPattern.test(name);
}

// Check if a phone number is valid (10 digits)
export function isPhoneValid(phone: string): boolean{
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
}

// Validate a street address in Nepal
export function isStreetAddressValid(address: string): boolean {
    const addressPattern = /^[a-zA-Z0-9\s,.-]{5,}$/; // At least 5 characters, allows letters, numbers, spaces, commas, periods, and dashes
    return addressPattern.test(address);
}

// Validate a ward number in Nepal
export function isWardValid(ward: number): boolean {
    return ward >= 1 && ward <= 32;
}

// Validate a municipality or district name in Nepal
export function isMunicipalityOrDistrictValid(name: string): boolean {
    const namePattern = /^[a-zA-Z\s-]{3,}$/; // At least 3 characters, allows letters, spaces, and hyphens
    return namePattern.test(name);
}

// Check if a time is in the correct format (HH:MM)
export function isTimeValid(time: string): boolean{
    const timePattern = /^(?:[0-9]|[01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(time);
}

// Check that the end time is after the start time
export function isEndAfterStart(startTime: string, endTime: string): boolean {
    // Helper function to convert time string (HH:MM) to total minutes since midnight
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Return true if start time is after end time
    return endMinutes > startMinutes;
}