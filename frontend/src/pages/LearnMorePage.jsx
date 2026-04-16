import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProgramById } from "../api/programsApi";


export default function LearnMorePage() {
  const { id } = useParams(); // read program ID from URL
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    getProgramById(id)
      .then((data) => setProgram(data))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }
  , [id]); // refetch when id changes

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

      <button onClick={() => navigate(`/programs/${id}/register`)}>
        Register
      </button>
    </div>
  );

}
