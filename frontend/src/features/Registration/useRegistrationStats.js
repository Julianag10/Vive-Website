import { useCallback, useEffect, useState } from "react";
import RegistrationService from "./RegistrationService";

const registrationService = new RegistrationService();

export default function useRegistrationStats(type, id, options = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshStats = useCallback(async () => {
    if (!id) {
      setStats(null);
      setLoading(false);
      setError(null);
      return null;
    }

    try {
      setLoading(true);
      const data = await registrationService.getRegistrationStats(type, id, options);
      setStats(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [type, id, options.occurrenceId]);

  useEffect(() => {
    let active = true;

    if (!id) {
      setStats(null);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    async function loadStats() {
      try {
        setLoading(true);
        const data = await registrationService.getRegistrationStats(type, id, options);

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
  }, [type, id, options.occurrenceId]);

  return { stats, loading, error, refreshStats };
}
