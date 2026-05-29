"use client";
import { useState, useEffect, useCallback } from "react";
import { getExperiences } from "@/services/experienceService";

export function useExperiences() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getExperiences();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { experiences: data, loading, error, refetch: fetchData };
}
