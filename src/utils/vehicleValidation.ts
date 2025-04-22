// Utility functions for validating vehicle-related data
// Check if a field is empty
export function isFieldEmpty(field: string): boolean{
    return field === '';
}

// Check if number input present
export function isNumberFieldPresent(field: number): boolean {
    return !!field;
}

// Check that license plate is valid
export function isValidLicensePlate(plate: string): boolean{
    const licensePattern = /^[a-zA-Z0-9\s,.-]{5,}$/; // At least 5 characters, allows letters, numbers, spaces, commas, periods, and dashes
    // TODO find actual pattern for Nepali license plate
    return licensePattern.test(plate);
}

// Check if capacity is greater than 0 and less than 100
export function isValidCapacity(capacity: number){
    return (capacity > 0 && capacity < 100);
}

// Check if capacity is greater than or equal to 0 and less than 100
export function isValidAvailability(availability: number){
    return (availability >= 0 && availability < 100);
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

// Check that availability is less than capacity
export function isUnderOrAtCapacity(capacity: number, availability: number): boolean {
    return capacity >= availability;
}