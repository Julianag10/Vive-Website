import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationService from "../../features/Registration/RegistrationService";
import RegistrationTable from "../../features/Registration/admin/RegistrationTable";
import "../../styles/admin-program-registrations.css";

const registrationService = new RegistrationService();

export default function AdminRegistrationsPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const data = await registrationService.getAdminRegistrations(type, id);
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [type, id]);

  const resourceLabel = type === "event" ? "Event" : "Program";

  if (loading) {
    return (
      <div className="admin-program-registrations">
        <p>Loading registrations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-program-registrations">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-program-registrations">
      <button onClick={() => navigate(`/admin/${type === "event" ? "events" : "programs"}`)}>
        ← Back to {resourceLabel}s
      </button>

      <h2>{resourceLabel} Registrations</h2>

      <RegistrationTable
        registrations={registrations}
        type={type}
      />
    </div>
  );
}