import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load programs ONCE when page mounts
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/programs");

        if (!res.ok) {
          throw new Error("Failed to load programs");
        }

        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  if (loading) return <p>Loading programs…</p>;
  if (error) return <p>Error: {error}</p>;
  if (programs.length === 0) return <p>No programs available.</p>;

  return (
    <div className="public-programs">
      <h1>Programs</h1>

      {programs.map((program) => (
        <div key={program.id} className="program-card">
          <h2>{program.title}</h2>

          {program.description && <p>{program.description}</p>}

          <p>
            {program.start_date} → {program.end_date}
          </p>

          <Link to={`/programs/${program.id}/register`}>Register</Link>
        </div>
      ))}
    </div>
  );
}
