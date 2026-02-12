import { NextResponse } from "next/server"
import type { User } from "@/src/types/user"

const users: User[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    role: "admin",
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Sara Mohamed",
    email: "sara@example.com",
    role: "editor",
    status: "active",
    createdAt: "2025-02-20",
  },
  {
    id: 3,
    name: "Omar Ali",
    email: "omar@example.com",
    role: "viewer",
    status: "inactive",
    createdAt: "2025-03-10",
  },
  {
    id: 4,
    name: "Nour Ibrahim",
    email: "nour@example.com",
    role: "editor",
    status: "active",
    createdAt: "2025-04-05",
  },
  {
    id: 5,
    name: "Youssef Khaled",
    email: "youssef@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2025-05-18",
  },
]

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return NextResponse.json(users)
}
