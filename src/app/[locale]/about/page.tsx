"use client";

 import Button from "@/src/components/ui/Button";
import { Pagination } from "@/src/components/ui/pagination";
import { useFetch } from "@/src/hooks/useFetch";

export default function AboutPage() {

  // if (loading) return <div>Loading...</div>;
 const metaData = {
    current_page: 1,
    from: 1,
    to: 10,
    last_page: 474,
    per_page: 10,
    total: 4734,
  };
  return (
    <div className="container">
      <h1>About Page</h1>
 
      <Button
      
        className="mt-5"
        loadingKey="projects"
      >
        Refetch
      </Button>
         <Pagination meta={metaData}  />
    </div>
  );
}
