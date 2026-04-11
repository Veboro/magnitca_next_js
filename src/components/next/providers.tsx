"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import "@/i18n/config";
import { LocaleSync } from "@/components/next/locale-sync";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleSync />
      {children}
    </QueryClientProvider>
  );
}
