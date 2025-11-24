import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";
import { ComponentProps } from "react";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
const {
  Link: NextIntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);

// Wrapper to disable prefetch by default for better performance during high load
export const Link = (props: ComponentProps<typeof NextIntlLink>) => {
  return <NextIntlLink {...props} />;
};

export { redirect, usePathname, useRouter, getPathname };
