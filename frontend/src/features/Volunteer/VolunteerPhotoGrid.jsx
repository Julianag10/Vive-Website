import { VOLUNTEER_IMAGES } from "./volunteerImages";
import "./volunteer.css";

export default function VolunteerPhotoGrid({ className = "" }) {
  const visibleImages = VOLUNTEER_IMAGES.slice(0, 2);

  return (
    <div className={`volunteer-photo-grid ${className}`.trim()}>
      {visibleImages.map((image) => (
        <img src={image.src} alt={image.alt} key={image.src} />
      ))}
    </div>
  );
}
