
export async function getPrograms() {
  const res = await fetch("/admin/api/programs", {
    credentials: "include",
  });

  // express attaches status code in res param and a json response body
  if(!res.ok) {
    // backend sends error message in res.body = errorData
    const errorData = await res.json(); //
    // errorData.error -> messge part of the error object
    throw new Error(errorData.error || "failed to load featured programs");
  }
  return res.json();
}


export async function postCreatedProgram(programData) {
  const res = await fetch("/admin/api/programs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify(programData),
  });

  if(!res.ok) {
    const errorData = await res.json(); //
    throw new Error(errorData.error || "failed to load featured programs");
  }
  return res.json();
}


export async function putUpdatedProgram(id, programData) {
  const res = await fetch(`/admin/api/programs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify(programData),
  });

  if(!res.ok) {
    const errorData = await res.json(); //
    throw new Error(errorData.error || "failed to load featured programs");
  }
  return res.json();

}

export async function patchToggleProgram(id, isActive) {
  const res = await fetch(`/admin/api/programs/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify({is_active: !isActive}),
  });

  if(!res.ok) {
    const errorData = await res.json(); //
    throw new Error(errorData.error || "failed to load featured programs");
  }
  return res.json();

}