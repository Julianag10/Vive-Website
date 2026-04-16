import EditProgramForm from "./EditProgramForm";
import { useNavigate } from "react-router-dom";

export default function ProgramCardAdmin({program, isEditing, onSaveEdit, onStartEdit, onCancleEdit, onToggleProgram}) {
  
  //navigat to NEWpage: programregistrations page
  const navigate = useNavigate();

  // CONDITONAL RENDERING: isEditing:
  // if isEditing chnages between renders then EditProgrmaForm will unmount and remount with new program data.
  // render all first, dont show edit form until clicked
  return (
    <div className="admin-program-card">
      {program.image_url && <img src={program.image_url} alt={program.title} />}

      {isEditing ? (
        <EditProgramForm
          program={program}
          onSaveEdit={onSaveEdit}
          onCancleEdit={onCancleEdit}
        />
      ) : (
        <>
          <h3>{program.title}</h3>
          <p>{program.description}</p>
          <p>
            {program.start_date || "No start date"} →{" "}
            {program.end_date || "No end date"}
          </p>
          <p>Capacity: {program.capacity ?? "N/A"}</p>
          <p>Status: {program.is_active ? "Active" : "Inactive"}</p>

          <div className="admin-program-card-butttons">
            <button onClick={() => onStartEdit(program.id)}>Edit Program</button>

            <button
              onClick={() => onToggleProgram(program.id, program.is_active)}
            >
              {program.is_active ? "Deactivate" : "Activate"}
            </button>

            <button
              onClick={() =>
                navigate(`/admin/programs/${program.id}/registrations`)
              }
            >
              View Registrations
            </button>
          </div>
        </>
      )}
    </div>
  );

}