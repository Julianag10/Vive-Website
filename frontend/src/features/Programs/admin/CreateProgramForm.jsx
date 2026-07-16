import ProgramForm, { BLANK_PROGRAM_FORM } from "./ProgramForm";

export default function CreateProgramForm({ onSaveCreate, featuredProgramCount }) {
  return (
    <ProgramForm
      initialForm={BLANK_PROGRAM_FORM}
      onSubmit={onSaveCreate}
      featuredProgramCount={featuredProgramCount}
      submitLabel="Create Program"
      formClassName="create-program-form"
    />
  );
}
