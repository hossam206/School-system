"use client";

import { useState, useEffect, useRef } from "react";

interface UseFetchOptions<T> {
  serverAction: () => Promise<T>;
  immediate?: boolean;
  onFetch?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useFetch<T>({
  serverAction,
  immediate = true,
  onFetch,
  onError,
}: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(immediate);

  // Ref to avoid multiple fetches in strict mode
  const fetchedRef = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serverAction();
      setData(result);
      onFetch?.(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && !fetchedRef.current) {
      fetchedRef.current = true; // mark as fetched
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]); // only run on mount

  return { data, error, loading, refetch: fetchData };
}
