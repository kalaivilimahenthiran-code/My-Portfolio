"use client";
import { useState, useEffect, useCallback } from "react";
import { getTestimonials } from "@/services/testimonialService";

export function useTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTestimonials();
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

  return { testimonials: data, loading, error, refetch: fetchData };
}
