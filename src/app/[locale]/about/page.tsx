"use client";

import { GET_PROJECTS } from "@/src/apis";
import { Select } from "@/src/components/ui/select";
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

 
   const users = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      email: "john.doe@example.com",
    },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ];
  function onSelect(id: string) {
    console.log("Selected ID:", id);
  }
  return (
    <div className="container">
      <h1>About Page</h1>
      <h1>{projects?.message}</h1>
      <Select
        items={users}
        // valueKey="id" // Returns the 'id' property
        labelKey="name" // Displays the 'name' property
        onSelect={onSelect}
        displayImg="avatar"
        placeholder="Select User"
      />
    </div>
  );
}
