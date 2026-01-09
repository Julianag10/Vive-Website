import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 6. rereder w/ saves state
export default function ProgramRegistrations() {
  // :id is a URL parameter
  // 1. react deconstructs the URL param object and gets id
  const { id } = useParams();
  const [rows, setRows] = useState([]);

  // 2. skips but react stores function + dependecy array
  // 4. component finshed render -> useEffect fucntinoruns w/ stored dep array
  // 7. id dosent change -> unEffect wont run after render
  // useEffect runs when [id] changes
  useEffect(() => {
    // GET admin/programs/:id/registrations -> returns registrations for ONE program
    fetch(`/admin/api/programs/${id}/registrations`)
      .then((res) => res.json())
      .then(
        // 5. saves the rows -> changes react state -> schedule rerender -> saves state
        // ONLY REMOUNT if NEXT RERENDER cahnges the JSX
        setRows
      );
  }, [id]);

  // 3. JSX for the first render -> mount in DOM
  // 8. JSX for rerender (w/ rows saved) -> mount in DOM
  return (
    <div>
      <h2>Registrations</h2>
      <ul>
        {rows.map((r, i) => (
          <li key={i}>
            {r.name} — {r.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
