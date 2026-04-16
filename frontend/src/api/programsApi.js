export async function getFeaturedPrograms() {
  const res = await fetch("/api/programs/featured");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load featured programs");
  }
  return res.json();
}

export async function getAllPrograms() {
  const res = await fetch("/api/programs");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load programs");
  }
  return res.json();
}

export async function getProgramById(id) {
  const res = await fetch(`/api/programs/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load program");
  }
  return res.json();
}