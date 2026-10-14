"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number | undefined>;
  children: ReactNode;
};

/** Link esterno (WhatsApp, telefono, email, mappe) con tracciamento opzionale. */
export function TrackedLink({ event, eventParams, onClick, children, ...rest }: Props) {
  const external = rest.href?.startsWith("http");
  return (
    <a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
