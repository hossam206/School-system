export const ROLES = ["student", "teacher", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type User = {
  id: string;
  userName: string;
  email: string;
  role: Role;
};

export type RegisterInput = {
  userName: string;
  email: string;
  password: string;
  role: Exclude<Role, "admin">;
};

export type LoginInput = { email: string; password: string };

export type Session = {
  _id: string;
  user: string;
  ipAddress: string | null;
  device: {
    type: "desktop" | "mobile" | "tablet" | "unknown";
    model: string | null;
    browser: { name: string | null; version: string | null };
    os: { name: string | null; version: string | null };
  };
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
};

// Every successful API response carries a message next to its data.
export type ApiResponse<T = object> = { success: true; message: string } & T;
