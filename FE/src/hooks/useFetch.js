import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/helpers";

/**
 * Loads data once per mount (StrictMode-safe via cleanup).
 * Pass reload() to refetch manually.
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const result = await fetcher();
        setData(result);
        return result;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        if (!silent) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetcher()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData, reload: load };
}
