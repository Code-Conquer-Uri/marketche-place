import { ReactNode } from "react";
import { Statements, userCan } from "@/lib/get-current-user";

export async function Permission<T extends keyof Statements>({
  action,
  resource,
  children,
  fallback,
}: {
  action: Statements[T][number];
  resource: T;
  children: ReactNode | ReactNode[];
  fallback: ReactNode | ReactNode[];
}) {
  const allowed = await userCan(action, resource);

  if (!allowed) {
    return fallback;
  }

  return children;
}
