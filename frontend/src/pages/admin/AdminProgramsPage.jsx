import { useEffect, useState } from "react";
import "../../styles/admin-programs.css";
import ProgramCardList from "../../features/Programs/admin/ProgramsCardList.jsx";
import CreateProgramForm from "../../features/Programs/admin/CreateProgramForm.jsx";
import EditProgramForm from "../../features/Programs/admin/EditProgramForm.jsx";
import DeleteProgramConfirmModal from "../../features/Programs/admin/DeleteProgramConfirmModal.jsx";
import {
  getPrograms,
  postCreatedProgram,
  putUpdatedProgram,
  patchToggleProgram,
  deleteProgram,
} from "../../features/Programs/ProgramService";

export default function AdminProgramsPage() {
  // programs state is an array
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editingProgramID, setEditingProgramID] = useState(null);
  const [deletingProgram, setDeletingProgram] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  // programs page -> load progrmas on mount
  useEffect( () => {
    const programsPromise = getPrograms();

    programsPromise.then(data => setPrograms(data))
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading programs…</p>;
  if (errorMessage) return <p> Error: {errorMessage} </p>;

  const featuredProgramCount = programs.filter((program) => program.is_featured).length;
  const editingProgram = programs.find((program) => program.id === editingProgramID);

  // CALLBACK: add program to programs array 
  async function onSaveCreate(newFormData) {
    // TODO add validation here !!
    const createdProgram = await postCreatedProgram(newFormData);

    // rerender programs list with new program
    // creates a brand new array with all old items plus the new one at the end
    setPrograms((prev) => [...prev, createdProgram]);
  }

  // CALLBACK: SET EDITING PR0GRAM ID CALLED FROM PROGRAMCARD
  function onStartEdit(currentEditID) {
    setEditingProgramID(currentEditID)
  }

  // CALLBACK: change state so that parent (adminProgams) can rerender children to make edit porgram form go away  
  async function onSaveEdit(editingID, updatedFormData) {
    
    const updatedProgram = await putUpdatedProgram(editingID, updatedFormData);

    // update program in programs array
    setPrograms((prevArray) =>
      // Mutating the old array = same reference = React thinks nothing changed = no rerender
      // reassingmeent only mutates existing state object -> React won't detect this change
      // need to create a new array with the updated program object to trigger rerender
      prevArray.map((prevProgram) =>
        prevProgram.id === editingID ? updatedProgram : prevProgram
      )
    );

    // rerenders so that edit for disappers and new card info shows 
    setEditingProgramID(null);
  }

  // CALLBACK: reset edit id to null + rerender to get edit orm to go away 
  function onCancleEdit() {
    setEditingProgramID(null);
  }


  // CALLBACK: rerender programs list: correct added/removed card
  async function onToggleProgram(toggleID, isActive){
    // recover old Program from DB
    const toggledProgram = await patchToggleProgram(toggleID, isActive); 

    // resetProgramsArray
    setPrograms((prevArray) => 
      prevArray.map((program) => 
        program.id === toggleID ? toggledProgram : program
    ));
  }

  async function onDeleteProgram(programToDelete) {
    const programId = programToDelete.id;
    const programName = programToDelete.title || "Program";

    await deleteProgram(programId);

    setPrograms((prevPrograms) =>
      prevPrograms.filter((program) => program.id !== programId)
    );

    if (editingProgramID === programId) {
      setEditingProgramID(null);
    }

    setDeletingProgram(null);
    setDeleteSuccessMessage(`${programName} was successfully deleted and erased from database`);
  }

  return (
    <div className="admin-programs-page">
      <h1>Programs</h1>

      {deleteSuccessMessage && (
        <p className="admin-program-delete-success" role="status" aria-live="polite">
          {deleteSuccessMessage}
        </p>
      )}
      
      <CreateProgramForm
        onSaveCreate={onSaveCreate}
        featuredProgramCount={featuredProgramCount}
      />

      <ProgramCardList 
        programs={programs}
        
        // "edit program" button is clicked, call onSaveEdit from program card to set editingID -> change state -> rerender with edit form
        editingProgramID={null} 

        onStartEdit={onStartEdit}
        onCancleEdit={onCancleEdit}
        
        onSaveEdit={onSaveEdit}

        onToggleProgram={onToggleProgram}
        onDeleteProgram={setDeletingProgram}
        featuredProgramCount={featuredProgramCount}
      />

      {editingProgram && (
        <div
          className="modal-backdrop is-open"
          onClick={onCancleEdit}
        >
          <div
            className="modal admin-edit-modal admin-program-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <EditProgramForm
              program={editingProgram}
              onSaveEdit={onSaveEdit}
              onCancleEdit={onCancleEdit}
              featuredProgramCount={featuredProgramCount}
            />
          </div>
        </div>
      )}

      {deletingProgram && (
        <DeleteProgramConfirmModal
          program={deletingProgram}
          onConfirm={() => onDeleteProgram(deletingProgram)}
          onClose={() => setDeletingProgram(null)}
        />
      )}
    </div>
  );
}
