import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const authFormSource = readFileSync(new URL("../components/auth-form.tsx", import.meta.url), "utf8");
const authPanelSource = readFileSync(new URL("../components/auth-panel.tsx", import.meta.url), "utf8");
const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const callbackSource = readFileSync(new URL("../app/auth/callback/route.ts", import.meta.url), "utf8");
const profileSetupSource = readFileSync(new URL("../components/profile-setup-form.tsx", import.meta.url), "utf8");
const authActionSource = readFileSync(new URL("../lib/actions/auth.ts", import.meta.url), "utf8");
const profileActionSource = readFileSync(new URL("../lib/actions/profile.ts", import.meta.url), "utf8");

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
  authFormSource,
  /<SubmitButton[\s\S]*?가입 확인 메일을 보내고 있어요/,
  "Sign-up submission should immediately show that a confirmation email is being sent.",
);

assert.match(
  authFormSource,
  /const showPasswordReset = intent === "signIn" && visibleMessage\?\.tone !== "success"/,
  "Password reset should stay hidden during sign-up and success states.",
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

assert.match(
  authPanelSource,
  /type AuthPanelProps = \{[\s\S]*?returnTo\?: string;/,
  "AuthPanel should accept a returnTo path so invite links survive login and sign-up.",
);

assert.match(
  authFormSource,
  /type AuthFormProps = \{[\s\S]*?returnTo\?: string;/,
  "AuthForm should accept a returnTo path from the current invite context.",
);

assert.match(
  authFormSource,
  /<input name="returnTo" type="hidden" value=\{returnTo\} \/>/,
  "AuthForm should submit returnTo as a hidden field.",
);

assert.match(
  authActionSource,
  /const returnTo = getSafeInternalPath\(formData\.get\("returnTo"\)\);/,
  "Auth actions should sanitize the submitted returnTo before redirects.",
);

assert.match(
  authActionSource,
  /\/auth\/callback\?next=\$\{encodeURIComponent\(returnTo\)\}/,
  "Sign-up email redirects should preserve returnTo through the auth callback next parameter.",
);

assert.match(
  authActionSource,
  /redirect\(authFeedbackPath\("notice", "check-email", returnTo\)\);/,
  "Email-confirmation notice redirects should keep inviteCode in the URL.",
);

assert.match(
  authActionSource,
  /redirect\(returnTo\);/,
  "Successful password login should return to the invite context instead of always redirecting home.",
);

assert.match(
  callbackSource,
  /getSafeInternalPath\(requestUrl\.searchParams\.get\("next"\)\)/,
  "Auth callback should normalize next to a safe internal path.",
);

assert.match(
  profileSetupSource,
  /type ProfileSetupFormProps = \{[\s\S]*?returnTo\?: string;/,
  "ProfileSetupForm should accept a returnTo prop.",
);

assert.match(
  profileSetupSource,
  /<input name="returnTo" type="hidden" value=\{returnTo\} \/>/,
  "ProfileSetupForm should preserve returnTo after saving the display name.",
);

assert.match(
  appPageSource,
  /const homeReturnTo = getHomeReturnTo\(params\);/,
  "Home page should derive a safe returnTo from inviteCode.",
);

assert.match(
  appPageSource,
  /<AuthPanel message=\{getAuthPanelMessage\(params\)\} returnTo=\{homeReturnTo\} \/>/,
  "Logged-out invite users should pass returnTo into AuthPanel.",
);

assert.match(
  appPageSource,
  /<ProfileSetupForm email=\{user\.email \?\? ""\} returnTo=\{homeReturnTo\} \/>/,
  "Profile setup should preserve inviteCode after auth.",
);

assert.match(
  profileActionSource,
  /const returnTo = getSafeInternalPath\(formData\.get\("returnTo"\)\);/,
  "Profile save should use the shared safe internal path helper.",
);

console.log("Auth form regression checks passed.");
