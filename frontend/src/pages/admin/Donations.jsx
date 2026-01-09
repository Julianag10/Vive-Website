import { useEffect, useState } from "react";

/*
RERENDER:
- React re-runs the component function
- JSX is recalculated
- React diffs old JSX vs new JSX
- DOM is updated in place
- State is preserved
- Effects do NOT re-run (unless deps change)

MOUNTS:
- Component is destroyed (by parent)
- Component is created again (called again)
- State is reset
- Effects clean up + re-run
- DOM nodes are removed and recreated
*/

// 1. coomponet called by parent -> starts render #1
// 6. render #2
export default function AdminDonations() {
  // State changes trigger renders.
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. skipped until after render #1
  // 5. render #1 finished -> runs useEffect
  useEffect(() => {
    // 5a. this function runs
    async function fetchDonations() {
      try {
        // 5b. calls backend
        const res = await fetch("/admin/api/donations", {
          // browser will attaches session cookie to req
          credentials: "include",
        });

        // backend response data from db: admin table
        const data = await res.json();

        // 5c. schedule render #2 but save donation
        setDonations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // 5d. save this data for render #2
        setLoading(false);
      }
    }

    // 5a. fetch donatin funtion runs
    fetchDonations();
  }, []);

  // 3. loading = true
  if (loading) {
    // 4. render #1 finshes (component MOuUNTS)
    // returns the JSX for render #1
    return <p>Loading donations…</p>;
  }

  if (error) return <p>Error: {error}</p>;

  if (donations.length === 0) {
    return <p>No donations found.</p>;
  }

  // 7. returns the JSX for render #2 -> render #2 finishes
  // returned JSX for render #2 is different from JSX render #1 -> DOM update
  return (
    <div>
      <h1>Donations</h1>

      {/* DONATIONS TABLE */}

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Donor Email</th>
          </tr>
        </thead>

        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{(donation.amount_cents / 100).toFixed(2)} USD</td>
              <td>{donation.status}</td>
              <td>{new Date(donation.created_at).toLocaleString()}</td>
              <td>{donation.donor_email || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
