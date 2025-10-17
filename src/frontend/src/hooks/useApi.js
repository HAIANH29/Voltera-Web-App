// src/hooks/useApi.js
import { useEffect, useState } from "react";
import { api } from "../config/api";

export function useApiGet(path, { params = {}, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(path, { params })
      .then((res) => !cancelled && setData(res.data))
      .catch((e) => !cancelled && setErr(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, deps); // ví dụ: [path] hoặc [path, ...deps]

  return { data, loading, error };
}
