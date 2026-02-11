"use client";

 import Button from "@/src/components/ui/Button";
import { useFetch } from "@/src/hooks/useFetch";

export default function AboutPage() {

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>About Page</h1>
 
      <Button
      
        className="mt-5"
        loadingKey="projects"
      >
        Refetch
      </Button>
    </div>
  );
}
