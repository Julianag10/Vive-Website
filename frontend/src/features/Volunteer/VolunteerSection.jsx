import VolunteerForm from "./VolunteerForm";
import VolunteerPhotoGrid from "./VolunteerPhotoGrid";
import "./volunteer.css";

export default function VolunteerSection({ className = "" }) {
  const sectionClassName = ["volunteer", className].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName}>
      <div className="volunteer-cta">
        <p className="volunteer-display-text">Create impact in your community.</p>
        <VolunteerForm />
      </div>
      <VolunteerPhotoGrid className="home-volunteer-photos" />
    </section>
  );
}
