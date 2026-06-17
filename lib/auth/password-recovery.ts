export type RecoverySessionTokens = {
  access_token: string;
  refresh_token: string;
};

function getHashParams(hash: string) {
  return new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
}

export function getRecoverySessionFromHash(hash: string): RecoverySessionTokens | null {
  const params = getHashParams(hash);
  const isRecovery = params.get("type") === "recovery";
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!isRecovery || !accessToken || !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export function getRecoveryRedirectPath(hash: string) {
  return getRecoverySessionFromHash(hash) ? `/auth/reset-password${hash}` : null;
}
