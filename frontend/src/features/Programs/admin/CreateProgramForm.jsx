import { useState } from "react";
import ProgramForm, { BLANK_PROGRAM_FORM } from "./ProgramForm";

export default function CreateProgramForm({ onSaveCreate, featuredProgramCount }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleCreate(formData) {
    await onSaveCreate(formData);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <div className="admin-program-create-row">
        <button
          className="admin-create-program-toggle"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Create Program
        </button>
      </div>
    );
  }

  return (
    <ProgramForm
      initialForm={BLANK_PROGRAM_FORM}
      onSubmit={handleCreate}
      featuredProgramCount={featuredProgramCount}
      submitLabel="Create Program"
      onCancel={() => setIsOpen(false)}
      formClassName="create-program-form"
      formTitle="Create Program"
    />
  );
}
