import { useEffect, useState } from "react";
import CarpoolApplicationCard from "../../components/CarpoolApplicationCard/CarpoolApplicationCard";

// mockData.ts
export type Child = {
  child_id: number;
  first_name: string;
  last_name: string;
  school_name: string;
  school_dropoff_time: string;
  school_pickup_time: string;
};

export type Passenger = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  children: Child[];
  location: {
    latitude: number;
    longitude: number;
  };
};

export type Application = {
  application_id: number;
  passenger: Passenger;
  status: "pending" | "approved" | "denied";
};

// Mock dataset
export const mockApplications: Application[] = [
  {
    application_id: 1,
    passenger: {
      user_id: 1,
      first_name: "John",
      last_name: "Doey",
      email: "johndoe@example.com",
      contact_number: "555-101-0001",
      children: [
        {
          child_id: 1,
          first_name: "James",
          last_name: "Doey",
          school_name: "Greenwood Elementary",
          school_dropoff_time: "08:00:00",
          school_pickup_time: "15:00:00",
        },
        {
          child_id: 2,
          first_name: "Jessica",
          last_name: "Doey",
          school_name: "Lincoln Middle School",
          school_dropoff_time: "08:30:00",
          school_pickup_time: "15:30:00",
        },
      ],

      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    status: "pending",
  },
  {
    application_id: 2,
    passenger: {
      user_id: 3,
      first_name: "Michael",
      last_name: "Smith",
      email: "msmith@example.com",
      contact_number: "555-101-0003",
      children: [
        {
          child_id: 3,
          first_name: "Ella",
          last_name: "Smith",
          school_name: "Greenwood Elementary",
          school_dropoff_time: "08:10:00",
          school_pickup_time: "15:10:00",
        },
      ],
      location: {
        latitude: 41.8781,
        longitude: -87.6298,
      },
    },
    status: "pending",
  },
  {
    application_id: 3,
    passenger: {
      user_id: 4,
      first_name: "Lisa",
      last_name: "Johnson",
      email: "ljohnson@example.com",
      contact_number: "555-101-0004",
      children: [
        {
          child_id: 4,
          first_name: "Noah",
          last_name: "Johnson",
          school_name: "Greenwood Elementary",
          school_dropoff_time: "08:20:00",
          school_pickup_time: "15:20:00",
        },
      ],
      location: {
        latitude: 29.7604,
        longitude: -95.3698,
      },
    },
    status: "pending",
  },
];

export default function CarpoolApplications() {
  const [applications, setApplications] = useState<Application[]>([]);

  // MOCK driver location for testing
  const driverLocation = { latitude: 40.73061, longitude: -73.935242 }; // NYC coords for example

  useEffect(() => {
    setApplications(mockApplications); // replace with API fetch when backend ready
  }, []);

  const handleDecision = (id: number, decision: "approved" | "denied") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.application_id === id ? { ...app, status: decision } : app
      )
    );
  };

  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  );

  return (
    <div className="p-6">
  <h1 className="text-xl font-bold mb-4">Carpool Applications</h1>
  {pendingApplications.length === 0 ? (
    <p>No applications.</p>
  ) : (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
      {pendingApplications.map((app) => (
        <CarpoolApplicationCard
          key={app.application_id}
          app={app}
          driverLocation={driverLocation}
          onDecision={handleDecision}
        />
      ))}
    </ul>
  )}
</div>

  );
}
