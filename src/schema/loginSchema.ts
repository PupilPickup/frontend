export const passwordValidationRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&\-_?])[A-Za-z\d!@#$%*&\-_?]{8,}$/;;

export const validatePassword = (password: string) => {
  return passwordValidationRegex.test(password);
};