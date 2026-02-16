"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/src/components/ui/data-table";
import type { ColumnDef, TableAction } from "@/src/components/ui/data-table";
import type { User } from "@/src/types/user";

const columns: ColumnDef<User>[] = [
  {
    key: "id",
    header: "ID",
    className: "w-[60px]",
  },
  {
    key: "name",
    header: "Name",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <span className=" overflow-auto inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
        {row.role}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Created At",
  },
];

const actions: TableAction<User>[] = [
  {
    label: "Edit",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (user) => console.log("Edit user:", user),
    variant: "default",
  },
  {
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (user) => console.log("Delete user:", user),
    variant: "destructive",
    show: (user) => user.role !== "admin",
  },
];

const metaData = {
  current_page: 1,
  from: 1,
  to: 10,
  last_page: 474,
  per_page: 10,
  total: 4734,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage your team members.</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        meta={metaData}
        loading={isLoading}
        emptyMessage="No users found."
        getRowId={(user) => user.id}
        onRowClick={(user) => console.log("Clicked:", user.name)}
      />
    </div>
  );
}
