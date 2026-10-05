import type { PropsWithChildren } from "react";

import { useAuth } from "@/hooks/auth";

import { AuthContext } from "./auth-context-value";

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
