// Check if a password is strong enough

export const validatePassword = (password: string) => {
  const passwordValidationRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&\-_?])[A-Za-z\d!@#$%*&\-_?]{8,}$/; //lowercases are now optional
  return passwordValidationRegex.test(password);
};

// Check if password and confirm password are same
export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

// Check if a field is empty
export function isFieldEmpty(field: string|number): boolean{
  return field === '';
}

// Check if a name is at least two alphabet characters long
export function isNameValid(name: string): boolean{
  const namePattern = /^[a-zA-Z]{2,}$/;
  return namePattern.test(name);
}

// Check if a phone number is valid (10 digits)
export function isPhoneValid(phone: string): boolean{
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(phone);
}

// Check if an email is valid
export function isEmailValid(email: string): boolean{
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Check if a username is valid (at least 6 alphanumeric characters)
export function isUsernameValid(username: string): boolean {
  const usernamePattern = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
  return usernamePattern.test(username);
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