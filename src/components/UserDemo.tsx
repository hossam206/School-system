"use client";

import { userStore } from "@/src/store/userStore";

type User = {
  id: string;
  name: string;
  avatar?: string;
};

export function UserDemo({ users }: { users: User[] }) {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const clearUser = userStore((state) => state.clearUser);

  return (
    <div className="flex gap-4 mt-4">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setUser(users[0] as any)}
      >
        Set User
      </button>
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => clearUser()}
      >
        Clear User
      </button>
      
      {user && (
        <div className="mt-4 p-4 border rounded">
          <p>Current User: {user.name}</p>
        </div>
      )}
    </div>
  );
}
