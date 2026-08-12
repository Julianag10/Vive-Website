import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProgramById } from "../features/Programs/ProgramService";
import { programImageSrc } from "../features/Programs/programImages";
import RegistrationPanel from "../features/Registration/RegistrationPanel";
import RegistrationLookup from "../features/Registration/RegistrationLookup";
import useRegistrationStats from "../features/Registration/useRegistrationStats";
import {
  formatDisplayDate,
  formatDisplayTimeRange,
} from "../utils/dateFormat";

// HELPER FUNCTION - format schedule for new database design allows different times for each recurring day.
function formatSchedule(program) {
  if (!program.schedules?.length) {
    return [];
  }

  return program.schedules.map((schedule)=>{
    return {
      day: schedule.day_of_week,
      time: formatDisplayTimeRange(schedule.start_time, schedule.end_time),
    };
    
  });
}

export default function LearnMorePage() {
  const { id } = useParams(); // read program ID from URL
  const [searchParams] = useSearchParams();
  const registrationRef = useRef(null);

  const [program, setProgram] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { stats, loading: loadingStats, error: statsError, refreshStats } = useRegistrationStats("program", id);

  useEffect(() => {
    setLoading(true);
    getProgramById(id)
      .then((data) => setProgram(data))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }
  , [id]); // refetch when id changes

  useEffect(() => {
    if (loading || !program) return;

    if (searchParams.get("register") === "1") {
      registrationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading, program, searchParams]);


  if (loading) return <p>Loading programs…</p>;
  if (errorMessage) return <p> Error: {errorMessage} </p>;
  if (!program) return <p>Program not found.</p>;

  const galleryImages = Array.from(
    new Set((program.gallery_images || []).filter(Boolean))
  );
  const scheduleItems = formatSchedule(program);

  return (
    <div className="learn-more-page">
      <section className="learn-more-hero">
        <div className="learn-more-copy">
          <h1>{program.title}</h1>
          <p>{program.description || "No description available."}</p>

          <div className="learn-more-meta-grid">
            <section className="event-details-location learn-more-location">
              <h3>Location</h3>
              <p>{program.location || "TBD"}</p>
            </section>

            <section className="event-details-location learn-more-capacity">
              <h3>Capacity</h3>
              <p>{program.capacity ?? "Unlimited"}</p>
              {stats && (
                <p className="learn-more-capacity-status">
                  {stats.remaining === 0
                    ? `At capacity. ${
                        stats.waitlisted === 1
                          ? "1 person is currently on the waitlist."
                          : `${stats.waitlisted} people are currently on the waitlist.`
                      }`
                    : `${stats.remaining} spots left`}
                </p>
              )}
            </section>
          </div>
        </div>

        <img
          className="learn-more-main-image"
          src={programImageSrc(program.image_url)}
          alt={program.title}
        />
      </section>

      <div className="learn-more-details-grid">
        {Array.isArray(program.activities) && program.activities.length > 0 && (
          <section className="event-details-notes learn-more-activities">
            <h3>Activities</h3>
            <ul>
              {program.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="event-details-schedule learn-more-schedule">
          <h3>Schedule</h3>
          <div className="learn-more-date-range">
            <p>
              <strong>Starts:</strong>{" "}
              {program.start_date
                ? formatDisplayDate(program.start_date)
                : "TBD"}
            </p>
            <p>
              <strong>Ends:</strong>{" "}
              {program.end_date
                ? formatDisplayDate(program.end_date)
                : "TBD"}
            </p>
          </div>
          <ul>
            {scheduleItems.map((item)=>(
              <li key={`${item.day}-${item.time}`}>
                <strong>{item.day}</strong>
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="program-gallery" aria-label={`${program.title} photos`}>
        <div className="program-gallery-grid">
          {galleryImages.length > 0 && (
            galleryImages.map((imageUrl, index) => (
              <img
                key={imageUrl}
                src={programImageSrc(imageUrl)}
                alt={`${program.title} photo ${index + 1}`}
              />
            ))
          )}
        </div>
      </section>

      <div className="learn-more-registration-area" ref={registrationRef}>
        <RegistrationLookup
          type="program"
          item={program}
        />
        
        <RegistrationPanel
          type="program"
          item={program}
          stats={stats}
          loading={loadingStats}
          error={statsError}
          onRegistrationChange={refreshStats}
        />
      </div>
    </div>
  );
}
