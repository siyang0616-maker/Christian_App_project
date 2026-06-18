export type RecoverySessionTokens = {
  access_token: string;
  refresh_token: string;
};

export type RecoveryTokenHash = {
  token_hash: string;
  type: "recovery";
};

function getHashParams(hash: string) {
  return new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
}

function getSearchParams(search: string) {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
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

export function getRecoveryTokenHashFromSearch(search: string): RecoveryTokenHash | null {
  const params = getSearchParams(search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type");

  if (!tokenHash || type !== "recovery") {
    return null;
  }

  return {
    token_hash: tokenHash,
    type,
  };
}
