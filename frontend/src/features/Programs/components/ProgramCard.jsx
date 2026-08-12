import { Link } from "react-router-dom";
import useRegistrationStats from "../../Registration/useRegistrationStats";
import { programImageSrc } from "../programImages";
import { formatDisplayDate } from "../../../utils/dateFormat";

// RENDERS ONE PROGRAM CARD


// PROGRAM CARD: display card for one program: reads program data, renders card program data + CTA to register
export default function ProgramCard({ program }) {
  const { stats, loading } = useRegistrationStats("program", program.id);
  const isWaitlistOnly = stats && stats.remaining === 0;
  const registrationStatusText = stats
    ? isWaitlistOnly
      ? `At capacity. ${stats.waitlisted === 1
          ? "1 person is currently on the waitlist."
          : `${stats.waitlisted} people are currently on the waitlist.`}`
      : `${stats.remaining} spots left`
    : "";

  return (
    <div className="program-card">

      <h2 className="program-card-title">{program.title}</h2>

      <div className="program-card-media">
        <img
          src={programImageSrc(program.image_url)}
          alt={program.title}
        />
      </div>

      <div className="program-card-copy">
        {/* <h3>{program.title}</h3> */}

        {program.description && (
          <p className="program-card-description">{program.description}</p>
        )}

        
        <div className="program-card-dates">
          <p>
            <strong>Starts:</strong>{" "}
            {formatDisplayDate(program.start_date)}
          </p>

          <p>
            <strong>Ends:</strong>{" "}
            {formatDisplayDate(program.end_date)}
          </p>
        </div>

        {Array.isArray(program.activities) && program.activities.length > 0 && (
          <div className="activities">
            <ul>
              {program.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="program-card-footer">
          <p className="program-card-registration-status">
            {registrationStatusText}
          </p>

          <div className="program-actions">
            <Link to={`/programs/${program.id}`} className="learnmore-btn btn btn-primary">
              Learn more
            </Link>

            <Link to={`/programs/${program.id}?register=1`} className="register-btn btn btn-primary">
              {loading ? "Register" : isWaitlistOnly ? "Join Waitlist" : "Register"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
