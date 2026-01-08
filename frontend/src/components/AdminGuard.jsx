import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  // LOADING TRUE PREVENTS anythign from loading after login until authenticated
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        // send credentials to backend to authenticate
        const res = await fetch("/admin/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        // if admin was NOT authenticaed in backend redures to login
        if (!data.admin) {
          navigate("/admin/login");
          return;
        }

        // triggere rerender -> next render it will skip authentications(useEffect)
        setLoading(false);
      } catch (err) {
        navigate("/admin/login");
      }
    }

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <p>Checking admin access…</p>;
  }

  return children;
}
