import { useEffect, useState } from "react";
import "../styles/programs.css";

import ProgramSection from "../features/Programs/components/ProgramSection";
import { getAllPrograms } from "../features/Programs/ProgramService";
// TODO prgrams shouldnt fethc bc programs --> who should fethc programs 
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
        const data = await getAllPrograms();
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

  // filter programs - BUT WHY DONT REMBER ??? 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // TODO Define the rule once
  // tDO why are rules defined here? should they be defined in the backend and sent as part of the program data? or should they be defined in a shared utils file that both frontend and backend can use to compute current/upcoming/featured programs consistently?
  // TODO RULE: current ->  is_active and start_date <= today <= end_date
  // TODO RULE: upcoming->  is_active and start_date > today
  // TODO RULE: featured = [...current, ...upcoming], sorted by start_date, limited to top N (ex: 3)
  // TODO why did i add upcoming progrms, sesonal progrmas, year long progrmas, after school progrmas, adult programs? do i need all these categories? can i just have current and upcoming?, ...
  // TODO should isActive be snake casee, match db?
  const getProgramPriority = (startDate, endDate) => {
    if (startDate <= today && endDate >= today) return 0;
    if (startDate > today) return 1;
    return 2;
  };

  const activePrograms = programs
    .filter((program) => program.is_active)
    .map((program, index) => {
      const startDate = new Date(program.start_date);
      const endDate = new Date(program.end_date);
      const startTime = startDate.getTime();

      return {
        program,
        index,
        priority: getProgramPriority(startDate, endDate),
        startTime: Number.isNaN(startTime) ? Number.MAX_SAFE_INTEGER : startTime,
      };
    })
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        a.startTime - b.startTime ||
        a.index - b.index,
    )
    .map(({ program }) => program);

  return (
    <div className="programs-page">
      <h1>Our Programs</h1>
      <ProgramSection title="Active Programs" programs={activePrograms} />
    </div>
  );
}
