import { Link } from "@/src/i18n/navigation";
import { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<LinkProps, "locale"> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    locale?: string;
  };

export default function MyLink({ children, className, ...props }: Props) {
  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  );
}
