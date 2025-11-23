"use client";

import { GET_PROJECTS } from "@/src/apis";
import { useFetch } from "@/src/hooks/useFetch";
import { useEffect } from "react";

export default function AboutPage() {
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useFetch({
    serverAction: GET_PROJECTS,
    onFetch: (res) => console.log("Fetched:", res),
    onError: (err) => console.log("Error:", err),
  });

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  console.log(projects, "aaaaaa");
  console.log(error, "asdsad");
  console.log(loading, "dsdadasdsad");

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="container">
      <h1>About Page</h1>
      <h1>{projects?.message}</h1>
    </div>
  );
}
