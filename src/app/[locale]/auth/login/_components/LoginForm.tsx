"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { Link } from "@/src/i18n/navigation";
import { loginSchema } from "@/src/lib/validation/auth";
import { login } from "@/src/services/auth";
import { userStore } from "@/src/store/userStore";
import { toastError } from "@/src/utils/toastError";

export default function LoginForm() {
  const t = useTranslations("auth");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const { user, message } = await login(values);
        toast.success(message);
        // the auth layout sends the user to the dashboard once they are stored
        userStore.getState().setUser(user);
      } catch (error) {
        toastError(error);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-5"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("loginTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("loginDescription")}
        </p>
      </div>

      <TextInput
        id="login-email"
        name="email"
        type="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        autocomplete="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
      />

      <TextInput
        id="login-password"
        name="password"
        type="password"
        label={t("password")}
        autocomplete="current-password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
      />

      <Button type="submit" size="lg" loading={formik.isSubmitting}>
        {t("login")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("createOne")}
        </Link>
      </p>
    </form>
  );
}
