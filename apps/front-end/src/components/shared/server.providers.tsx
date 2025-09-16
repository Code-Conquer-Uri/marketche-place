import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { FC, ReactNode } from "react";

export const ServerProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};
