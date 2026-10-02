import { createMetadata } from "@/src/utils/generateMetadata";
import RegisterForm from "./_components/RegisterForm";

export const generateMetadata = createMetadata(
  "register.Title",
  "register.Description",
);

export default function RegisterPage() {
  return <RegisterForm />;
}
