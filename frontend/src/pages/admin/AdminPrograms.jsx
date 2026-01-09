import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPrograms() {
  // progrmas state is array of programs
  // bc page displays all progrmas, fetchPrograms()
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // create program form inline on progrmas page (NO MODAL YET)
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    capacity: "",
  });

  const navigate = useNavigate();

  // FETCH PROGRAMS ON MOUNT
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/admin/api/programs", {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to load programs");
        }

        const data = await res.json();

        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();

    // WHY DOSE EMPTY DEP ARRAY MAKE USEEFECT ONLY RUN ONVE ON MOUNT
  }, []);

  if (loading) return <p>Loading programs…</p>;
  if (error) return <p>Error: {error}</p>;
  if (programs.length === 0) return <p>No programs found.</p>;

  // OUTSIDE USEEFFECT:
  // toggleProgram() runs only when user clicks:
  //  fetch side effect: -> triggered by an event -> not automatic (useEffect for automatic effects)
  //                    -> not tied to render timing -> side effect wont effect life cycle
  // fetch sideeffect isnt tied to component life cycle like fetch in fetchPrograms
  // onClick -> no sde effects during render
  // but why no side effects during render???

  // TOGGLE PROGRAM ACTIVE / INACTIVE
  async function toggleProgram(programId, currentActive) {
    try {
      const res = await fetch(`/admin/api/programs/${programId}/active`, {
        // PATCH != GET
        // GET -> no req.body -> just asking for data (not sending data in req.body)
        method: "PATCH",
        // since i am sending JSON, so backend needs to knwo how to parse what i am sending (req.body)
        headers: { "Content-Type": "application/json" },
        // send session cookie in header
        credentials: "include",
        // HTTP bosyies must be JSON sting: convert JS obj:{active: ....} -> JSON string
        body: JSON.stringify({ is_active: !currentActive }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update program");
      }

      // res.json(program);

      // page displays all programs: fetchPrograms()
      // toggleProgram() just changes 1 field in 1 program obj from prgrmams[] state

      // sice toofle Progrma() is called with bse button -> fronend lalready knwo s which prgram was clicked
      // so fron end dosent need back end to knwo what program got activated/deactivates
      // but need fetch to update database truth
      // setPrograms(value) vs setPrograms(functinonal)
      // If new state depends on previous state → always use functional setState
      // prevProgrma Because programs might be stale if multiple updates happen.
      // also React guarantees prevPrograms is the latest state
      // setPrograms(prevProgrma => ...) Required when new state depends on old state
      // setPrograms((prevPrograms) => ...) -> takes prev UI state and update it to reflect what we expect the backend to now have
      setPrograms((prevPrograms) =>
        // react state(programs) must be IMMUTATBLE -> state object need to be replaced NOT modifed
        // .map() bc dont want to mutate its original state (can only change state with setState())
        // .map() bc -> want new STATE array with ONE item changed (bc state in immutable so it neeed to be replaced wiht entire new waray)
        prevPrograms.map(
          (program) =>
            program.id === programId // IF CONDITION
              ? // {...program} -> mkaes a shallow copy of program
                // {active: !currentActive } -> overided the active field of program
                // so active field is toggled -> entire program object is not mutated,
                // program.is_active would mutate program object DONT WANT THAT, WE WANT TO REPLACE
                { ...program, is_active: !currentActive } // IF TRUE
              : program //IF FALSE
        )
      );
    } catch (err) {
      // setError is for page level errors
      // toggel errors area not worth blocking entire page
      // alrets arent errors page will stillooad
      alert(err.message);
    }
  }

  // CREATE PROGRAM FORM: handle input changes
  // give my funtion event = input change, bc: <input... onChange={}>
  function handleChange(e) {
    // e.target is the DOM element that triggerd the event = input
    // so e is the event and e.target is my acutal dom ele so that it can be used
    // e.target.name === "title"
    // e.target.value === "Yoga Class"
    const { name, value } = e.target;

    // each input change only updates 1 field at a time
    // BUT form state has mulitpe fields , so mkae a copy and then change one field in frorm state obj
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // CREATE PROGRAM FORM: submit handler
  async function handleCreateProgram(e) {
    e.preventDefault();

    try {
      const res = await fetch("/admin/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          // sending a copy of the form to the backend, and convert it to JSON
          ...form,
          capacity: Number(form.capacity),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Create failed");
      }

      const newProgram = await res.json();

      // add to UI immediately
      setPrograms((prev) => [...prev, newProgram]);

      // reset form
      setForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        capacity: "",
      });
    } catch (err) {
      alert(err.message);
    }
  }

  // SAVE EDITED PROGRAM
  async function saveEdit(programId) {
    try {
      const res = await fetch(`/admin/api/programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }

      const updatedProgram = await res.json();

      setPrograms((prev) =>
        prev.map((p) => (p.id === programId ? updatedProgram : p))
      );

      setEditingProgramId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>Programs</h1>

      {/* CREATE PROGRAM FORM */}
      <h2>Create Program</h2>

      <form onSubmit={handleCreateProgram}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          // when this <input name= "xxx"...> changes, call my function and give it an event
          // give my funtion event = input change, bc: <input... onChange={}>
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
        />

        <button type="submit">Create Program</button>
      </form>

      {/* PROGRAMS TABLE */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {programs.map((program) => (
            // WHEN: programs.map(program => <tr>...</tr>)
            // REACT needs Which row is which between renders?

            // without keys:
            // - react may reuse the wrong row
            // - buttons act on the wrong item

            // with keys:
            // - This row = that program
            // - Only update what actually changed
            <tr key={program.id}>
              {editingProgramId === program.id ? (
                // EDIT MODE JSX:
                // IF this program is currently being edited, show input fields
                // Only ONE row enters edit mode at a time.
                // <tr> -> table row
                // <td> -> colom cell

                // JSX requires one parent element -> FRAGMENTS
                // START REACT FRAGMENT
                <>
                  <td>
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          capacity: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>{program.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => saveEdit(program.id)}>Save</button>
                    <button onClick={() => setEditingProgramId(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                // END REACT FRAGMENT
                // START REACT FRAGMENT
                // NORMAL VIEW JSX
                // OTHERWISE show normal text + buttons
                <>
                  <td>{program.title}</td>
                  <td>{program.capacity}</td>
                  <td>{program.is_active ? "Active" : "Inactive"}</td>

                  <td>
                    <button
                      onClick={() => {
                        setEditingProgramId(program.id);
                        setEditForm({
                          title: program.title,
                          capacity: program.capacity,
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleProgram(program.id, program.is_active)
                      }
                    >
                      {program.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/programs/${program.id}/registrations`)
                      }
                    >
                      View Registrations
                    </button>
                  </td>
                </>
                // END REACT FRAGMENT
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
