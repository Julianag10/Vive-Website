// --------------------------------------------------
//             PUBLIC API CALLS
// --------------------------------------------------
export async function getStaff() {
  const res = await fetch("/api/staff");

  if (!res.ok) {
    throw new Error("Failed to load staff");
  }

  const data = await res.json();
  return data;
}
// --------------------------------------------------
//             ADMIN API CALLS
// --------------------------------------------------

// createStaff
export async function createStaff(formData) {
  const response = await fetch("/admin/api/staff", {
    method: "POST",
    credentials: "include",
    body: formData, // NOT JSON
  });

  if (!response.ok) {
    throw new Error("Failed to create staff member.");
  }

  return response.json();
}

// deleteStaff
export async function deleteStaff(id) {
  const response = await fetch(`/admin/api/staff/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete staff member.");
  }

  return true;
}

// updateStaff
export async function updateStaff(id, formData) {  // TODO FIX HERE
  const response = await fetch(`/admin/api/staff/${id}`, {
    method: "PUT",
    credentials: "include",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: formData, // NOT JSON
  });

  if (!response.ok) {
    throw new Error("Failed to update staff member.");
  }

  return response.json();
}
