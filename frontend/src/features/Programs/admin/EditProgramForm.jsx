import ProgramForm, { programToForm } from "./ProgramForm";

export default function EditProgramForm({
  program,
  onSaveEdit,
  onCancleEdit,
  featuredProgramCount,
}) {
  async function handleSubmit(formData) {
    await onSaveEdit(program.id, formData);
  }

  return (
    <ProgramForm
      initialForm={programToForm(program)}
      onSubmit={handleSubmit}
      featuredProgramCount={featuredProgramCount}
      isExistingFeatured={program.is_featured}
      existingProgram={program}
      submitLabel="Save Program"
      onCancel={onCancleEdit}
      formClassName="create-program-form admin-program-edit-form"
      formTitle="Edit Program"
    />
  );
}
