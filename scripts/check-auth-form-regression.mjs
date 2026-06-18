import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const authFormSource = readFileSync(new URL("../components/auth-form.tsx", import.meta.url), "utf8");
const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

assert.match(
  authFormSource,
  /<form action=\{submitAuth\}[\s\S]*?<\/form>/,
  "AuthForm should keep a dedicated sign-in/sign-up form.",
);

const mainForm = authFormSource.match(/<form action=\{submitAuth\}[\s\S]*?<\/form>/)?.[0] ?? "";

assert.doesNotMatch(
  mainForm,
  /requestPasswordReset|resetPassword/,
  "Password reset should not be a submit action inside the main login form.",
);

assert.match(
  authFormSource,
  /<form action=\{requestPasswordReset\}/,
  "Password reset should live in its own form so mobile login submit cannot trigger it.",
);

const mainSubmitIndex = authFormSource.indexOf("{intentCopy[intent].submit}");
const resetFormIndex = authFormSource.indexOf("<form action={requestPasswordReset}");

assert.ok(
  mainSubmitIndex !== -1 && resetFormIndex !== -1 && mainSubmitIndex < resetFormIndex,
  "The primary login/sign-up button should appear before the password reset form.",
);

assert.match(
  appPageSource,
  /error === "login-invalid"[\s\S]*?이메일 또는 비밀번호가 맞지 않아요/,
  "Invalid login credentials should show a clear email/password message.",
);

assert.match(
  appPageSource,
  /error === "reset-rate-limit"[\s\S]*?비밀번호 재설정/,
  "Password reset rate limits should be labeled as password-reset specific.",
);

console.log("Auth form regression checks passed.");
