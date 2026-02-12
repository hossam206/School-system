export type User = {
  id: number
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
  createdAt: string
}
