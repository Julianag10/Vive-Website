import { useState } from "react";

export default function RegistrationTable({ registrations = [], type, onEmailRegistrant }) {
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  if (registrations.length === 0) {
    return <p>No registrations yet.</p>;
  }

  return (
    <>
      <table className="admin-program-registrations-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registered At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{registration.createdAt.toLocaleString()}</td>
              <td>{registration.status}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegistration(registration);
                    if (onEmailRegistrant) {
                      onEmailRegistrant(registration);
                    }
                  }}
                >
                  Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRegistration && (
        <p>
          Selected {type} registrant: {selectedRegistration.name}
        </p>
      )}
    </>
  );
}