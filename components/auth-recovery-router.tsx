"use client";

import { useEffect } from "react";
import { getRecoveryRedirectPath } from "@/lib/auth/password-recovery";

export function AuthRecoveryRouter() {
  useEffect(() => {
    const redirectPath = getRecoveryRedirectPath(window.location.hash);

    if (!redirectPath || window.location.pathname === "/auth/reset-password") {
      return;
    }

    window.location.replace(redirectPath);
  }, []);

  return null;
}
