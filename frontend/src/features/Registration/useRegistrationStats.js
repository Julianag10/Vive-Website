import { useEffect, useState } from "react";
import RegistrationService from "./RegistrationService";

const registrationService = new RegistrationService();

export default function useRegistrationStats(type, id) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!id) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    async function loadStats() {
      try {
        setLoading(true);
        const data = await registrationService.getRegistrationStats(type, id);

        if (active) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, [type, id]);

  return { stats, loading, error };
}