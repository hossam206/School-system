"use client";

import { GET_PROJECTS } from "@/src/apis";
import Button from "@/src/components/ui/Button";
import { useFetch } from "@/src/hooks/useFetch";

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

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>About Page</h1>
      <h1>{projects?.message}</h1>

      <Button
        onClick={() => {
          refetch();
        }}
        className="mt-5"
        loadingKey="projects"
      >
        Refetch
      </Button>
    </div>
  );
}
