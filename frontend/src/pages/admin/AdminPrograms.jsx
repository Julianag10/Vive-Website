import { useEffect, useState } from "react";
import ProgramCardList from "../../components/admin/ProgramsCardList.jsx";
import CreateProgramForm from "../../components/admin/createProgramForm.jsx";
import {
  getPrograms,
  postCreatedProgram,
  putUpdatedProgram,
  patchToggleProgram,
} from "../../api/admin/programsApi";

export default function AdminProgramsPage() {
  // programs state is an array
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editingProgramID, setEditingProgramID] = useState(null);

  // programs page -> load progrmas on mount
  useEffect( () => {
    const programsPromise = getPrograms();

    programsPromise.then(data => setPrograms(data))
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading programs…</p>;
  if (errorMessage) return <p> Error: {errorMessage} </p>;


  // CALLBACK: add prgram to prgrams array 
  async function onSaveCreate(newFormData) {
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

  return (
    <div className="admin-programs-page">
      <h1>Programs</h1>
      
      <CreateProgramForm onSaveCreate={onSaveCreate}/>

      <ProgramCardList 
        programs={programs}
        
        // "edit program" button is clicked, call onSaveEdit from program card to set editingID -> change state -> rerender with edit form
        editingProgramID={editingProgramID} 

        onStartEdit={onStartEdit}
        onCancleEdit={onCancleEdit}
        
        onSaveEdit={onSaveEdit}

        onToggleProgram={onToggleProgram}
      />
    </div>
  );
}