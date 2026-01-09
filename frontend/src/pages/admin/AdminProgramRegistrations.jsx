import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/*
PROGRAM REGISTRATIONS PAGE
--------------------------
Route: /admin/programs/:id/registrations

Responsibilities:
- Fetch registrations for a specific program
- Display them in a readable table
- Handle loading / error / empty states
- Stay protected by AdminGuard (parent routing)
*/

export default function ProgramRegistrations() {
  // URL PARAM: /admin/programs/:id/registrations
  const { id } = useParams(); // program id from URL

  const navigate = useNavigate();

  // STATE
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH REGISTRATIONS ON MOUNT
  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const res = await fetch(`/admin/api/programs/${id}/registrations`, {
          credentials: "include", // 🔐 send session cookie
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load registrations");
        }

        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [id]);

  // ---------- UI STATES ----------
  if (loading) {
    return <p>Loading registrations…</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (registrations.length === 0) {
    return (
      <div>
        <button onClick={() => navigate("/admin/programs")}>
          ← Back to Programs
        </button>

        <h2>Program Registrations</h2>
        <p>No registrations for this program yet.</p>
      </div>
    );
  }

  // ---------- MAIN RENDER ----------
  return (
    <div>
      <button onClick={() => navigate("/admin/programs")}>
        ← Back to Programs
      </button>

      <h2>Program Registrations</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registered At</th>
          </tr>
        </thead>

        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{new Date(registration.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
