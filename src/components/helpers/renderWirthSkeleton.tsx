import React, { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type RenderWithSkeletonProps = {
  value: unknown;
  skeletonWidth?: number | string;
  skeletonHeight?: number | string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

export const RenderWithSkeleton = React.memo(function RenderWithSkeleton({
  value,
  skeletonWidth = 50,
  skeletonHeight = 20,
  className,
  children,
  ariaLabel = "Loading content",
  ...props
}: RenderWithSkeletonProps) {
  const isValueEmpty = (val: unknown) => {
    if (val === null || val === undefined) return true;
    if (typeof val === "string") return val.trim() === "";
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "object") return Object.keys(val || {}).length === 0;
    return false;
  };
  if (isValueEmpty(value)) {
    return (
      <Skeleton
        style={{
          width:
            typeof skeletonWidth === "number"
              ? `${skeletonWidth}px`
              : skeletonWidth || "50px",
          height:
            typeof skeletonHeight === "number"
              ? `${skeletonHeight}px`
              : skeletonHeight || "20px",
        }}
        className={className}
        aria-label={ariaLabel}
        {...props}
      />
    );
  }

  return <>{children}</>;
});
