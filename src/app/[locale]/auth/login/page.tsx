import React from "react";
import "@/src/utils/YupExtensions";
import * as Yup from "yup";
const Page = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    username: Yup.string()
      .required("Requiredx  ")
      .arabicOnly("Only English letters allowed"),
  });

  return (
    <div className="container max-w-2xl my-6 mx-auto flex items-start justify-center   border border-gray-300 rounded-md">
      hello
    </div>
  );
};
export default Page;