import * as Yup from "yup";

// Same rules and messages as the API's zod schemas, so most errors are caught
// before submit. `id` keys the checklist label in the "auth.passwordRules" messages.
export const PASSWORD_RULES = [
  {
    id: "length",
    message: "Password must be at least 8 characters long",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    message: "Password must contain at least one uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    message: "Password must contain at least one lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "number",
    message: "Password must contain at least one number",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    id: "special",
    message: "Password must contain at least one special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

const email = Yup.string()
  .trim()
  .required("Email is required")
  .email("Please provide a valid email address");

export const loginSchema = Yup.object({
  email,
  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),
  email,
  password: PASSWORD_RULES.reduce(
    (schema, rule) =>
      schema.test(rule.id, rule.message, (value = "") => rule.test(value)),
    Yup.string()
      .required("Password is required")
      .max(72, "Password must not exceed 72 characters")
  ),
  role: Yup.string()
    .required("Role must be either student or teacher")
    .oneOf(["student", "teacher"], "Role must be either student or teacher"),
});
