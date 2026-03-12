import { useEffect, useState } from "react";
import "../styles/programs.css";

import ProgramSection from "../components/ProgramSection";

// TODO CHANEG file NAEM TO PAGE
// TODO fetch all public programs from /api/programs,
// TODO split into sections (start with only current + upcoming).
// TODO compute only currentPrograms and upcomingPrograms first.
// TODO Use ProgramSection to avoid repreated grid code
export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load programs ONCE when page mounts:
  // fetch all programs once then filter
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs");

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

  // filter programs
  const today = new Date();

  // TODO Define the rule once
  // tDO why are rules defined here? should they be defined in the backend and sent as part of the program data? or should they be defined in a shared utils file that both frontend and backend can use to compute current/upcoming/featured programs consistently?
  // TODO RULE: current ->  is_active and start_date <= today <= end_date
  // TODO RULE: upcoming->  is_active and start_date > today
  // TODO RULE: featured = [...current, ...upcoming], sorted by start_date, limited to top N (ex: 3)
  // TODO why did i add upcoming progrms, sesonal progrmas, year long progrmas, after school progrmas, adult programs? do i need all these categories? can i just have current and upcoming?, ...
  // TODO should isActive be snake casee, match db?
  const currentPrograms = programs.filter(
    (p) =>
      p.is_active &&
      new Date(p.start_date) <= today &&
      new Date(p.end_date) >= today,
  );

  const upcomingPrograms = programs.filter(
    (p) => p.is_active && new Date(p.start_date) > today,
  );

  const afterSchoolPrograms = programs.filter(
    (p) => p.is_active && p.category === "after-school",
  );

  const adultPrograms = programs.filter(
    (p) => p.is_active && p.audience === "adult",
  );

  return (
    <div className="programs-page">
      <h1>Our Programs</h1>
      <ProgramSection title="Current Programs" programs={currentPrograms} />
      <ProgramSection title="Upcoming Programs" programs={upcomingPrograms} />
    </div>
  );
}
