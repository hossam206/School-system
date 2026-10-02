"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/src/components/ui/Button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 text-foreground">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">{t("errorTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("errorDescription")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="btn-primary"
            onClick={reset}
            prefix={<RotateCcw className="size-4" aria-hidden="true" />}
          >
            {t("retry")}
          </Button>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <Home className="size-4" aria-hidden="true" />
            {t("backToDashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}
