// Connect React to your backend (health check)
export async function checkHealth() {
    const res = await fetch("http://localhost:3000/api/health");
    return res.json();
}
