import React from "react";
import IndentProvider from "@/contexts/IndentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <IndentProvider>{children}</IndentProvider>;
}
