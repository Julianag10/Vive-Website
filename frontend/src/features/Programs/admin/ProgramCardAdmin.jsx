import EditProgramForm from "./EditProgramForm";
import { useNavigate } from "react-router-dom";
import { programImageSrc } from "../programImages";
import {
  formatDisplayDate,
  formatDisplayTime,
} from "../../../utils/dateFormat";

function scheduleItems(schedules = []) {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return [];
  }

  return schedules
      .map((schedule) => {
      const day = schedule.day_of_week || "Day TBD";
      const startTime = formatDisplayTime(schedule.start_time, "");
      const endTime = formatDisplayTime(schedule.end_time, "");
      const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "Time TBD";

      return `${day}: ${timeRange}`;
    });
}

export default function ProgramCardAdmin({program, isEditing, onSaveEdit, onStartEdit, onCancleEdit, onToggleProgram, onDeleteProgram, featuredProgramCount}) {
  
  //navigat to NEWpage: programregistrations page
  const navigate = useNavigate();

  // CONDITONAL RENDERING: isEditing:
  // if isEditing chnages between renders then EditProgrmaForm will unmount and remount with new program data.
  // render all first, dont show edit form until clicked
  return (
    <div className="admin-program-card">
      {isEditing ? (
        <EditProgramForm
          program={program}
          onSaveEdit={onSaveEdit}
          onCancleEdit={onCancleEdit}
          featuredProgramCount={featuredProgramCount}
        />
      ) : (
        <>
          <div className="admin-program-card-copy">
            <div className="admin-program-card-heading-row">
              <h3>{program.title}</h3>
              <div className="admin-program-card-statuses">
                <span className={`admin-program-status ${program.is_active ? "is-active" : "is-inactive"}`}>
                  {program.is_active ? "Active" : "Inactive"}
                </span>
                <span className={`admin-program-status ${program.is_featured ? "is-featured" : "is-not-featured"}`}>
                  {program.is_featured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>

            {program.image_url && (
              <img
                className="admin-program-card-image"
                src={programImageSrc(program.image_url)}
                alt={program.title}
              />
            )}

            <p className="admin-program-card-description">{program.description}</p>

            <dl className="admin-program-card-meta">
              <div>
                <dt>Location</dt>
                <dd>{program.location || "No location"}</dd>
              </div>
              <div>
                <dt>Dates</dt>
                <dd>
                  {formatDisplayDate(program.start_date, "No start date")} → {formatDisplayDate(program.end_date, "No end date")}
                </dd>
              </div>
              <div>
                <dt>Schedule</dt>
                <dd>
                  {scheduleItems(program.schedules).length > 0 ? (
                    scheduleItems(program.schedules).map((schedule, index) => (
                      <div key={index}>{schedule}</div>
                    ))
                  ) : (
                    "None"
                  )}
                </dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{program.capacity ?? "N/A"}</dd>
              </div>

              <div>
                <dt>Activities</dt>
                <dd>
                  {Array.isArray(program.activities) && program.activities.length > 0 ? (
                    <ul className="admin-program-card-activities">
                      {program.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="admin-program-card-actions">
            <button className="admin-program-card-action admin-program-card-action--edit" type="button" onClick={() => onStartEdit(program.id)}>
              Edit Program
            </button>

            <button
              className="admin-program-card-action admin-program-card-action--toggle"
              type="button"
              onClick={() => onToggleProgram(program.id, program.is_active)}
            >
              {program.is_active ? "Deactivate" : "Activate"}
            </button>

            <button
              className="admin-program-card-action admin-program-card-action--registrations"
              type="button"
              onClick={() => navigate(`/admin/registrations/program/${program.id}`)}
            >
              View Registrations
            </button>

            <button
              className="admin-program-card-action admin-program-card-action--delete"
              type="button"
              onClick={() => onDeleteProgram(program)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );

}
