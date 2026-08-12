import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  // LOADING TRUE PREVENTS anythign from loading after login until authenticated
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        // fetch == SIDEEFEFCT (talks to outside world. ...)
        // http://localhost:5173/admin/auth/me
        // http = networking -> browser (networking stack) -> proxy intercepts -> backend
        // send credentials to backend to authenticate
        const res = await fetch("/admin/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/admin/login");
          return;
        }

        const data = await res.json();

        // if admin was NOT authenticaed in backend redures to login
        if (!data.admin) {
          navigate("/admin/login");
          return;
        }

        // schedules rerender -> next render it will skip authentications(useEffect)
        if (isMounted) {
          setLoading(false);
        }
      } catch {
        navigate("/admin/login");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return <p>Checking admin access…</p>;
  }

  return children;
}
