"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  CircleHelp,
  LogOut,
  Monitor,
  MonitorSmartphone,
  RotateCcw,
  Smartphone,
  Tablet,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import Button from "@/src/components/ui/Button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getActiveSessions } from "@/src/services/sessions";
import type { Session } from "@/src/types/auth";
import { toastError } from "@/src/utils/toastError";
import { RevokeSessionDialog } from "./RevokeSessionDialog";

type State =
  | { status: "loading" }
  | { status: "error" }
  // loadedAt pins "now" for the relative times so rendering stays pure
  | { status: "ready"; sessions: Session[]; loadedAt: number };

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: CircleHelp,
};

const cardStyles = "rounded-lg border border-border bg-card";

export default function SessionsView() {
  const t = useTranslations("sessions");
  const tc = useTranslations("common");
  const format = useFormatter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [revoking, setRevoking] = useState<Session | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getActiveSessions().then(
      (sessions) => {
        if (active) {
          setState({ status: "ready", sessions, loadedAt: Date.now() });
        }
      },
      (error) => {
        // toast even if a 401 already sent the user away, so they see why
        toastError(error);
        if (active) setState({ status: "error" });
      }
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  // e.g. "Pixel 8 · Chrome 141 on Android 14"; the API sends nulls when it
  // can't parse the user agent, so fall back to the device type
  const describeDevice = ({ type, model, browser, os }: Session["device"]) => {
    const browserName =
      browser.name &&
      [browser.name, browser.version?.split(".")[0]].filter(Boolean).join(" ");
    const osName = os.name && [os.name, os.version].filter(Boolean).join(" ");
    const software =
      browserName && osName
        ? t("deviceOn", { browser: browserName, os: osName })
        : browserName || osName;
    return [model, software].filter(Boolean).join(" · ") || t(`devices.${type}`);
  };

  const formatDate = (iso: string) =>
    format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            {t("title")}
            {state.status === "ready" && (
              <Badge variant="secondary">{state.sessions.length}</Badge>
            )}
          </span>
        }
        description={t("description")}
      />

      {state.status === "loading" && (
        <div className={`${cardStyles} divide-y divide-border`} aria-busy="true">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex gap-4 p-4 sm:p-5">
              <Skeleton className="size-10 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {state.status === "error" && (
        <EmptyState
          className={cardStyles}
          icon={<TriangleAlert />}
          title={t("loadError")}
          action={
            <Button
              variant="outline"
              onClick={retry}
              prefix={<RotateCcw className="size-4" aria-hidden />}
            >
              {tc("retry")}
            </Button>
          }
        />
      )}

      {state.status === "ready" && state.sessions.length === 0 && (
        <EmptyState
          className={cardStyles}
          icon={<MonitorSmartphone />}
          title={t("emptyTitle")}
        />
      )}

      {state.status === "ready" && state.sessions.length > 0 && (
        <ul className={`${cardStyles} divide-y divide-border overflow-hidden`}>
          {state.sessions.map((session) => {
            const Icon = DEVICE_ICONS[session.device.type];
            const lastActive = new Date(session.lastActiveAt);

            return (
              <li
                key={session._id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground wrap-break-word">
                      {describeDevice(session.device)}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {session.ipAddress ?? t("unknownIp")} ·{" "}
                      <time
                        dateTime={session.lastActiveAt}
                        title={formatDate(session.lastActiveAt)}
                      >
                        {t("lastActive", {
                          time: format.relativeTime(lastActive, state.loadedAt),
                        })}
                      </time>
                    </p>
                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      {[
                        { label: t("signedIn"), iso: session.createdAt },
                        { label: t("expires"), iso: session.expiresAt },
                      ].map(({ label, iso }) => (
                        <div key={label} className="flex gap-1.5">
                          <dt>{label}</dt>
                          <dd className="text-foreground">
                            <time dateTime={iso}>{formatDate(iso)}</time>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-center"
                  prefix={<LogOut className="size-4 rtl:rotate-180" aria-hidden />}
                  onClick={() => {
                    setRevoking(session);
                    setDialogOpen(true);
                  }}
                >
                  {t("revoke")}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <RevokeSessionDialog
        session={revoking}
        deviceLabel={revoking ? describeDevice(revoking.device) : ""}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        // The UI can't tell which session is this device (its id is inside the
        // httpOnly token), so the list is always reloaded afterwards: if this
        // device's session was revoked, that reload gets a 401 and ends on login.
        onDone={() => setAttempt((n) => n + 1)}
      />
    </>
  );
}
