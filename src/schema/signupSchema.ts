export const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePassword = (password: string) => {
  return passwordValidationRegex.test(password);
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};