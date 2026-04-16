import ProgramCard from "./ProgramCard";

// TODO: DO I EVEN NEED THIS I DONT THINK SO BC i can jus t render porgram cards from program page, or shoud i change porgram 
// TODO keep as a porgrma card container for programs page ??
export default function ProgramSection({ title, programs }) {
  if (!Array.isArray(programs) || programs.length === 0) {
    return null;
  }

  return (
    <section className="program-section">
      <h2>{title}</h2>
      <div className="program-grid">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}

