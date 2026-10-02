"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { Link, useRouter } from "@/src/i18n/navigation";
import { registerSchema } from "@/src/lib/validation/auth";
import { cn } from "@/src/lib/utils";
import { ApiError } from "@/src/services/api";
import { register } from "@/src/services/auth";
import type { RegisterInput } from "@/src/types/auth";
import { toastError } from "@/src/utils/toastError";
import { PasswordChecklist } from "./PasswordChecklist";

const ROLE_OPTIONS = ["student", "teacher"] as const;

type RegisterFormValues = Omit<RegisterInput, "role"> & {
  role: RegisterInput["role"] | "";
};

export default function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const formik = useFormik<RegisterFormValues>({
    initialValues: { userName: "", email: "", password: "", role: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const { message } = await register(values as RegisterInput);
        toast.success(message);
        // registering doesn't log in, so the user continues on the login page
        router.push("/auth/login");
      } catch (error) {
        toastError(error);
        if (error instanceof ApiError && error.status === 409) {
          // "Email already exists, try login now" or "userName with this value already exist"
          setFieldError(
            error.message.startsWith("userName") ? "userName" : "email",
            error.message
          );
        }
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
          {t("registerTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("registerDescription")}
        </p>
      </div>

      <TextInput
        id="register-name"
        name="userName"
        label={t("name")}
        placeholder={t("namePlaceholder")}
        mandatory
        autocomplete="name"
        maxLength={100}
        value={values.userName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.userName}
        touched={touched.userName}
      />

      <TextInput
        id="register-email"
        name="email"
        type="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        mandatory
        autocomplete="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
      />

      <div className="flex flex-col gap-2.5">
        <TextInput
          id="register-password"
          name="password"
          type="password"
          label={t("password")}
          mandatory
          autocomplete="new-password"
          maxLength={72}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
        />
        <PasswordChecklist
          password={values.password}
          showErrors={!!touched.password}
        />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-foreground">
          {t("role")} <span className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((role) => (
            <label
              key={role}
              className={cn(
                "flex h-11 cursor-pointer items-center gap-3 rounded-md border border-input bg-card px-3 text-sm font-medium text-foreground shadow-xs transition-colors",
                "hover:bg-accent has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary",
                "has-focus-visible:ring-2 has-focus-visible:ring-ring/30",
                touched.role && errors.role && "border-destructive"
              )}
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={values.role === role}
                onChange={handleChange}
                onBlur={handleBlur}
                className="size-4 accent-primary"
              />
              {t(`roles.${role}`)}
            </label>
          ))}
        </div>
        {touched.role && errors.role && (
          <p className="text-xs text-destructive">{errors.role}</p>
        )}
      </fieldset>

      <Button type="submit" size="lg" loading={formik.isSubmitting}>
        {t("register")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
