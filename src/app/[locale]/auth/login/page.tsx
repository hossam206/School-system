import { createMetadata } from "@/src/utils/generateMetadata";
import LoginForm from "./_components/LoginForm";

export const generateMetadata = createMetadata(
  "login.Title",
  "login.Description",
);

export default function LoginPage() {
  return <LoginForm />;
}
