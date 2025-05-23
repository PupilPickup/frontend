// Utility functions for validating child-related data
  // Check if a field is empty
  export function isFieldEmpty(field: string|number): boolean{
    return field === '';
  }
  
  // Check if a name is at least two alphabet characters long
  export function isNameValid(name: string): boolean{
    const namePattern = /^[a-zA-Z]{2,}$/;
    return namePattern.test(name);
  }
  
  // Check if a time is in the correct format (HH:MM)
  export function isTimeValid(time: string): boolean{
    const timePattern = /^(?:[0-9]|[01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(time);
  }

  // Check that the pickup time is after the dropoff time
  export function isPickupAfterDropoff(pickupTime: string, dropoffTime: string): boolean {
    // const pickup = new Date(`1970-01-01T${pickupTime}:00Z`);
    // const dropoff = new Date(`1970-01-01T${dropoffTime}:00Z`);
    // return pickup > dropoff;
    // Helper function to convert time string (HH:MM) to total minutes since midnight
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const pickupMinutes = timeToMinutes(pickupTime);
    const dropoffMinutes = timeToMinutes(dropoffTime);

    // Return true if pickup time is after dropoff time
    return pickupMinutes > dropoffMinutes;
}
