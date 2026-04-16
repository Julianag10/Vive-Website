import { Link } from "react-router-dom";

// TODO learn more CTA vs register CTA: "register CTA-primary" vs learn more CTA-secondary(link)
// TODO WIRE registration url to backend: ProgramCard CTA goes straight to registration form.
// TODO wire  activities to backend

// PROGRAM CARD: display card for one program: reads program data, renders card program data + CTA to register
export default function ProgramCard({ program }) {
  return (
    <div className="program-card">
      <img
        src={program.image_url || "/img/placeHolder.png"}
        alt={program.title}
      />

      <h3>{program.title}</h3>

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
      </div>
    </div>
  );
}


