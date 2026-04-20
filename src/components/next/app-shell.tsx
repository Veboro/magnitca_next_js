"use client";

import { PropsWithChildren } from "react";
import { PublicFooter } from "@/components/next/public-footer";
import { PublicHeader } from "@/components/next/public-header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
