import { useEffect, useState } from "react";
import { checkHealth } from "./api/health";

function App() {
    const [status, setStatus] = useState("loading...");

    useEffect(() => {
        checkHealth()
            .then(data => setStatus(data.status))
            .catch(() => setStatus("backend unreachable"));
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>VIVE React Frontend</h1>
            <p>Backend status: {status}</p>
        </div>
    );
}

export default App;
