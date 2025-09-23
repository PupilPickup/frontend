import { useState } from "react";
import {
  Child,
  Application,
} from "../../pages/carpool_applications/CarpoolApplications";
import Button from "../../components/common/Button";

// Function to calculate distance between two coordinates using Haversine formula
function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

type Props = {
  app: Application;
  driverLocation: { latitude: number; longitude: number };
  onDecision: (id: number, decision: "approved" | "denied") => void;
};

export default function CarpoolApplicationCard({
  app,
  driverLocation,
  onDecision,
}: Props) {
  const [showChildren, setShowChildren] = useState(false);

  const distanceKm = distance(
    driverLocation.latitude,
    driverLocation.longitude,
    app.passenger.location.latitude,
    app.passenger.location.longitude
  );

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="mb-2">
        <p className="font-semibold">
          {app.passenger.first_name} {app.passenger.last_name}
        </p>
        <p className="text-sm text-gray-600">{app.passenger.email}</p>
        <p className="text-sm text-gray-600">{app.passenger.contact_number}</p>
        <p className="text-sm text-gray-600 mt-1">
          Distance from your home: {distanceKm.toFixed(1)} km
        </p>

        <button
          className="text-blue-500 underline mt-2"
          onClick={() => setShowChildren(!showChildren)}
        >
          {showChildren ? "Hide children" : "Show children to approve"}
        </button>

        {showChildren && (
          <div className="mt-2 space-y-2">
            {app.passenger.children.map((child) => (
              <div
                key={child.child_id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm w-full"
              >
                <p className="font-semibold">
                  {child.first_name} {child.last_name}
                </p>
                <p>{child.school_name}</p>
                <ul className="list-disc list-inside ml-4 text-sm mt-1">
                  <li>
                    <span className="font-bold">Dropoff:</span>{" "}
                    {child.school_dropoff_time}
                  </li>
                  <li>
                    <span className="font-bold">Pickup:</span>{" "}
                    {child.school_pickup_time}
                  </li>
                </ul>
                {app.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      label="Approve"
                      variant="primary"
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-sm min-w-[4rem]"
                      onClick={() => {
                        if (window.confirm(`Approve ${child.first_name}?`)) {
                          onDecision(app.application_id, "approved");
                        }
                      }}
                    />
                    <Button
                      label="Deny"
                      variant="secondary"
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm min-w-[4rem]"
                      onClick={() => {
                        if (window.confirm(`Deny ${child.first_name}?`)) {
                          onDecision(app.application_id, "denied");
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
