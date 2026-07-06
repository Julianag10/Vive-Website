import { Link } from "react-router-dom";
import useRegistrationStats from "../../Registration/useRegistrationStats";

// RENDERS ONE PROGRAM CARD


// PROGRAM CARD: display card for one program: reads program data, renders card program data + CTA to register
export default function ProgramCard({ program }) {
  const { stats, loading } = useRegistrationStats("program", program.id);
  const isWaitlistOnly = stats && stats.remaining === 0;

  return (
    <div className="program-card">
      <div className="program-card-media">
        <img
          src={program.image_url || "/img/placeHolder.png"}
          alt={program.title}
        />
      </div>

      <div className="program-card-copy">
        <h3>{program.title}</h3>

        {program.description && (
          <p className="program-card-description">{program.description}</p>
        )}

        <p className="program-card-dates">
          {program.start_date || program.startDate || "TBD"} → {program.end_date || program.endDate || "TBD"}
        </p>

        {Array.isArray(program.activities) && program.activities.length > 0 && (
          <ul className="activities">
            {program.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        )}

        <div className="program-actions">
          <Link to={`/programs/${program.id}`} className="learnmore-btn">
            Learn more
          </Link>

          <Link to={`/programs/${program.id}?register=1`} className="register-btn">
            {loading ? "Register" : isWaitlistOnly ? "Join Waitlist" : "Register"}
          </Link>
        </div>

        {stats && (
          <p className="program-card-registration-status">
            {isWaitlistOnly
              ? "At capacity. You can join the waitlist."
              : `${stats.remaining} spots left`}
          </p>
        )}
      </div>
    </div>
  );
}


