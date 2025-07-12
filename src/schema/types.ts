// Define the structure of the user data to be used throughout the app
export interface UserData {
  username: string;
  userId: string;
  email: string;
  roles: string[];
}

// Define the structure of the user data to be used throughout the app
export interface FullProfileData {
  username: string;
  userId: string;
  email: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  wardNumber: number;
  municipalityDistrict: string;
  roles: string[];
  accountCreatedAt: Date;
}

// Define the structure of the user data to be used throughout the app
export interface PartialProfileData {
  username: string;
  userId: string;
  email: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  roles: string[];
}