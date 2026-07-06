import ProgramCardAdmin from "./ProgramCardAdmin";


export default function ProgramCardList({programs, editingProgramID, onStartEdit, onSaveEdit, onCancleEdit, onToggleProgram, featuredProgramCount}) {

  if (!programs || programs.length === 0) return <p>No programs.</p>;

  return (
    <div className="admin-program-list">

      {programs.map( (program) => (
        
        <ProgramCardAdmin 
          key={program.id} program={program}

          // editingID set in program page = null
          // first check or when no "edit porgram" button hasbeen clicked
          // but programCard calls onSaveEdit() to send progrma id of the program card that was clicked 
          // onStatrEdit changes state and rerenders adn passes a not null edting id to cardlist, 
          // cardlist now matches the current porgramID to one that is being edited, 
          // is editing is now true and passed to porgramcard
          // now program card will know that that card is being edited so it will call the editfrom to render 
          isEditing={editingProgramID === program.id}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancleEdit={onCancleEdit}
          onToggleProgram={onToggleProgram}
          featuredProgramCount={featuredProgramCount}
        />
      ))}

    </div>
  );
  
}
