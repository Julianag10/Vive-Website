


// TODO learn more CTA vs register CTA: "register CTA-primary" vs learn more CTA-secondary(link)
// TODO WIRE registration url to backend: ProgramCard CTA goes straight to registration form.
// TODO wire  activities to backend  

// PROGRAM CARD: display card for one program: reads program data, renders card program data + CTA to register
function ProgramCard({ program }) {
  
  return (
    <div className="program-card">

      <img src={program.image_url || "/img/placeHolder.png" } alt={program.title} />

      <h3>{program.title}</h3>

      <p>{program.description}</p>

      <ul className="activities">
        {program.activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>


      <div className="program-actions">
        <a href={`/programs/${program.id}`} className="learnmore-btn">
          Learn more
        </a>

        {program.isRegistrable && program.registrationUrl && (
          <a
            href={program.registrationUrl}
            className="register-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register
          </a>
        )}
      </div>
    </div>
  );
}

export default ProgramCard;
