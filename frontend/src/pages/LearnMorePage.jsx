import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getProgramById } from "../features/Programs/ProgramService";
import RegistrationPanel from "../features/Registration/RegistrationPanel";
import RegistrationLookupPanel from "../features/Registration/RegistrationLookup";
import useRegistrationStats from "../features/Registration/useRegistrationStats";

export default function LearnMorePage() {
  const { id } = useParams(); // read program ID from URL
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const registrationRef = useRef(null);

  const [showRegistration, setShowRegistration] = useState(
    searchParams.get("register") === "1"
  );
  const [showLookup, setShowLookup] = useState(false);

  const [program, setProgram] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { stats, loading: loadingStats } = useRegistrationStats("program", id);



  useEffect(() => {
    getProgramById(id)
      .then((data) => setProgram(data))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }
  , [id]); // refetch when id changes

  useEffect(() => {
    if (searchParams.get("register") === "1") {
      setShowRegistration(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showRegistration) {
      registrationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showRegistration]);

  useEffect(() => {
    if (searchParams.get("register") === "1") {
      setShowRegistration(true);
    }
  }, [location.pathname, location.search, searchParams]);

  if (loading) return <p>Loading programs…</p>;
  if (errorMessage) return <p> Error: {errorMessage} </p>;
  if (!program) return <p>Program not found.</p>;

  return (
    <div className="learn-more-page">
      {program.image_url && <img src={program.image_url} alt={program.title} />}
      <h1>{program.title}</h1>
      <p>{program.description || "No description available."}</p>

      <p>Start: {program.start_date || "TBD"}</p>
      <p>End: {program.end_date || "TBD"}</p>
      <p>Capacity: {program.capacity ?? "Unlimited"}</p>

      {Array.isArray(program.activities) && program.activities.length > 0 && (
        <ul>
          {program.activities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}

      {stats && (
        <p>
          {stats.remaining === 0
            ? "This program is at capacity. Joining will place you on the waitlist and you will be emailed if a spot opens up."
            : `${stats.remaining} spots left`}
        </p>
      )}

      <button onClick={() => setShowLookup((current) => !current)}>
        Already Registered?
      </button>

      <div ref={registrationRef}>

      {showLookup && (
        <RegistrationLookupPanel
            type="program"
            item={program}
        />
      )}
      
        {showRegistration && (
          <RegistrationPanel
            type="program"
            item={program}
          />
        )}
      </div>

      
    </div>
  );
}
