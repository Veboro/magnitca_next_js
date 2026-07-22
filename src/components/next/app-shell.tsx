"use client";

import { PropsWithChildren } from "react";
import { PublicFooter } from "@/components/next/public-footer";
import { PublicHeader } from "@/components/next/public-header";
import { ShareBar } from "@/components/next/share-bar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-14 lg:pb-0">
      <PublicHeader />
      {children}
      <PublicFooter />
      <ShareBar />
    </div>
  );
}
