import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>ViVe Wellness</h1>

      <p>Supporting community wellness through programs and resources.</p>

      <nav style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link to="/donate">Donate</Link>
        <Link to="/programs">Programs</Link>
      </nav>
    </div>
  );
}
