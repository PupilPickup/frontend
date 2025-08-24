import exp from "constants";

// Define the structure of the user data to be used throughout the app
export interface UserData {
  username: string;
  userId: string;
  email: string;
  roles: number[];
  latitude: number;
  longitude: number;
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
  latitude: number;
  longitude: number;
  roles: number[];
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
  latitude: number;
  longitude: number;
  roles: number[];
}

// Define the structure of the driver data to be used throughout the app
export interface CarpoolListData {
  userId: string;
  firstName: string;
  lastName: string;
  latitude: number;
  longitude: number;
  vehicleId: string;
  licensePlate: string;
  seatingCapacity: number
  seatsAvailable: number;
  driverStartTime: string;
  driverEndTime: string;
  daysAvailable: string[];
}

// Define the structure of the driver data to be used throughout the app
export interface DriverData {
  userId: string;
  driverName: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
}