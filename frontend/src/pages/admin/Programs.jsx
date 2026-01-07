import { useEffect, useState } from "react";

export default function AdminPrograms() {
  // programs -> array of
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // GET /admin/progrmas -> returns a List active programs
    fetch("/admin/api/programs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load programs");

        return res.json();
      })
      .then(setPrograms)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!programs.length) return <p>No programs found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Programs</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <strong>{program.title}</strong> — capacity {program.capacity} —{" "}
            {program.is_active ? "ACTIVE" : "INACTIVE"}
            <br />
            <a href={`/admin/programs/${program.id}/registrations`}>
              View registrations
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
