"use client";

import { GET_PROJECTS } from "@/src/apis";
import Button from "@/src/components/ui/Button";
import { Select } from "@/src/components/ui/select";
import { useFetch } from "@/src/hooks/useFetch";
import { userStore } from "@/src/store/userStore";
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
  const setuser = userStore((state) => state.setUser);
  const clearUser = userStore((state) => state.clearUser);
  const updateuser = userStore((state) => state.updateUser);
  const userInfo = userStore((state) => state.user);

  return (
    <div className="container">
      <h1>About Page</h1>
      <h1>{projects?.message}</h1>
      <button onClick={() => setuser(users[0])}>Set User</button>
      <button onClick={() => clearUser()}>Clear User</button>
      <button onClick={() => updateuser({ email: "hossam" })}>
        Update User
      </button>
      <Select
        items={users}
        // valueKey="id" // Returns the 'id' property
        labelKey="name" // Displays the 'name' property
        onSelect={onSelect}
        displayImg="avatar"
        placeholder="Select User"
      />

      <Button onClick={() => refetch()} className="mt-5">Refetch</Button>
    </div>
  );
}
