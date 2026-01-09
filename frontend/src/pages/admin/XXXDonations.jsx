import { useEffect, useState } from "react";

// 7. rerender but with state rembered
export default function AdminDonations() {
  // useState -> lets compnonet remember data between renders(state)
  // donations -> current state vlaue = array of current list of donation rows
  // setDonations -> react function that updates state (updates the list)
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect runs after the render, BUT react STORES the FuNCTIon and teh DEPENDENCY ARRAY
  // 7. dep array astill [] -> useEffect wotn run again after rerender
  // useEffect -> lets a component run side effects (thigns outside rendering) like fetching from backend
  // useEffect -> tale a fucntion, the function runa after react renders the component to the screen
  useEffect(() => {
    // 3. fetch runs (HTTP reuest) -> async -> returns a promise
    // /admin/donation -> call backend GET /admin/donations -> backendreturn/list all donations from db
    fetch("/admin/api/donations")
      // 4. fetch finisehs
      // .then -> when promise finishes
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load donations");

        // NOT IN EXPRESS: res.json() -> take Http res body parse JSON -> JS object
        // return response as JS object: parsed JS array of all donations in database
        return res.json();
      })
      // .then runs after first .then returns
      .then(
        // teh values returned from previous .then becomes the argument
        // data -> stores the current array of donation rows in state
        (data) => setDonations(data)
        // 5. setDonations() -> updates state -> schedules rerender -> react reruns component
        // 6. will ONLY cause a REMOUNT if during the rerender JSX tree changes
        // but conponent rembers state betwen renders
      )
      .catch((err) => setError(err.message));
    // 6. useEffect wint run again bc it only runs after render but the only thign that cuases a rended if the if (!donations), buthtis will only run when the component mounts
    // dependency arrya -> empty -> run once when teh component mounts
    // [] -> load once on page open
  }, []);

  // if fetch fails -> display the stores error state from .catch
  if (error) return <p>Error: {error}</p>;
  // 1. returns JSX: this is teh JSX for this render -> MPUNT component to DOM
  if (!donations.length) return <p>No donations found.</p>;

  // 8. Jsx returned for the seconf render -> DOM update
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Donations</h2>
      <ul>
        {donations.map((donation) => (
          <li key={donation.id}>
            ${(donation.amount_cents / 100).toFixed(2)} — {donation.status} —{" "}
            {donation.donor_email || "anonymous"}
          </li>
        ))}
      </ul>
    </div>
  );
}
