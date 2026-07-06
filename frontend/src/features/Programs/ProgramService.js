// PUBLIC + ADMIN API CALLS

async function readJsonOrThrow(res, fallbackMessage) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || fallbackMessage);
    }

    return data;
  }

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || fallbackMessage);
  }

  throw new Error("Expected JSON response from server");
}

// --------------------------------------------------
//             PUBLIC API CALLS
// --------------------------------------------------

export async function getFeaturedPrograms() {
  const res = await fetch("/api/programs/featured");
  return readJsonOrThrow(res, "Failed to load featured programs");
}

export async function getAllPrograms() {
  const res = await fetch("/api/programs");
  return readJsonOrThrow(res, "Failed to load programs");
}

export async function getProgramById(id) {
  const res = await fetch(`/api/programs/${id}`);
  return readJsonOrThrow(res, "Failed to load program");
}

// --------------------------------------------------
//             ADMIN API CALLS
// --------------------------------------------------

export async function getPrograms() {
  const res = await fetch("/admin/api/programs", {
    credentials: "include",
  });

  return readJsonOrThrow(res, "Failed to load programs");
}


export async function postCreatedProgram(programData) {
  const res = await fetch("/admin/api/programs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify(programData),
  });

  return readJsonOrThrow(res, "Failed to create program");
}


export async function putUpdatedProgram(id, programData) {
  const res = await fetch(`/admin/api/programs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify(programData),
  });

  return readJsonOrThrow(res, "Failed to update program");

}

export async function patchToggleProgram(id, isActive) {
  const res = await fetch(`/admin/api/programs/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body:JSON.stringify({is_active: !isActive}),
  });

  return readJsonOrThrow(res, "Failed to update program status");

}
