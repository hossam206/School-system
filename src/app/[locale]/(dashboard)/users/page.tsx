"use client"

import { useQuery } from "@tanstack/react-query"
import { Pencil, Trash2 } from "lucide-react"
import { DataTable } from "@/src/components/ui/data-table"
import type { ColumnDef, TableAction } from "@/src/components/ui/data-table"
import type { User } from "@/src/types/user"

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
      <span className="max-w-[200px] overflow-auto inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
        {row.role} + 'dadasdsad dasdasd dasdasd asd a dadasdsad dasdasd dasdasd asd a dadasdsad dasdasd dasdasd asd a dadasdsad dasdasd dasdasd asd a dadasdsad dasdasd dasdasd asd a dadasdsad dasdasd dasdasd asd a'
      </span>
    ),
    className: "bg-red-500",
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
]

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
]

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      return response.json()
    },
  })

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
        loading={isLoading}
        emptyMessage="No users found."
        getRowId={(user) => user.id}
        onRowClick={(user) => console.log("Clicked:", user.name)}
      />
    </div>
  )
}
