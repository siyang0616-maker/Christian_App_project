import type { Route } from "next";

export const actionErrorMessages = {
  "profile-invalid": {
    title: "이름을 다시 확인해 주세요",
    body: "동행방에서 사용할 이름은 1자 이상 30자 이하로 입력해 주세요.",
  },
  "profile-save": {
    title: "프로필을 저장하지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 계속 어렵다면 베타 운영자에게 알려주세요.",
  },
  "group-invalid": {
    title: "동행방 이름을 다시 확인해 주세요",
    body: "동행방 이름은 1자 이상 40자 이하로 입력해 주세요.",
  },
  "group-create": {
    title: "동행방을 만들지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 이미 여러 번 실패했다면 베타 운영자에게 알려주세요.",
  },
  "invite-invalid": {
    title: "초대코드를 다시 확인해 주세요",
    body: "리더에게 받은 초대코드를 4자 이상 10자 이하로 입력해 주세요.",
  },
  "invite-join": {
    title: "동행방에 참여하지 못했어요",
    body: "초대코드가 맞는지 확인해 주세요. 계속 어렵다면 리더에게 새 코드를 요청해 주세요.",
  },
  "checkin-invalid": {
    title: "체크인 내용을 다시 확인해 주세요",
    body: "오늘 마음과 공개 범위를 선택했는지 확인해 주세요.",
  },
  "checkin-save": {
    title: "체크인을 저장하지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 공개 범위나 동행방 참여 상태가 바뀌었을 수 있어요.",
  },
  "prayer-invalid": {
    title: "기도제목을 다시 확인해 주세요",
    body: "기도제목은 1자 이상 500자 이하로 입력해 주세요.",
  },
  "prayer-save": {
    title: "기도제목을 저장하지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 공개 범위나 동행방 참여 상태가 바뀌었을 수 있어요.",
  },
  "prayer-reaction": {
    title: "기도했어요를 남기지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 볼 수 있는 기도제목에만 반응할 수 있어요.",
  },
  "prayer-care": {
    title: "기도 돌봄 표시를 저장하지 못했어요",
    body: "잠시 후 다시 시도해 주세요. 리더에게 보이는 기도제목에만 돌봄 표시를 남길 수 있어요.",
  },
} as const;

export const actionSuccessMessages = {
  "checkin-saved": {
    title: "오늘 체크인이 저장됐어요",
    body: "위의 오늘 상태 카드에 방금 남긴 마음이 반영됐어요. 다시 고치고 싶으면 체크인 수정을 눌러주세요.",
  },
  "prayer-saved": {
    title: "기도제목이 저장됐어요",
    body: "아래 기도제목 카드 목록에 새 카드로 추가됐어요.",
  },
  "prayer-reaction-saved": {
    title: "기도로 기억했어요",
    body: "기도했어요 반응이 카드에 반영됐어요.",
  },
  "prayer-care-saved": {
    title: "기도 돌봄 표시를 저장했어요",
    body: "이 제목은 리더 보드에서 함께 기도할 일과 조용히 돌볼 일로 다시 볼 수 있어요.",
  },
} as const;

export type ActionErrorCode = keyof typeof actionErrorMessages;
export type ActionSuccessCode = keyof typeof actionSuccessMessages;

export function getSafeInternalPath(value: FormDataEntryValue | string | null | undefined, fallback: Route = "/") {
  if (typeof value !== "string") {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  if (/[\u0000-\u001F\u007F]/.test(value)) {
    return fallback;
  }

  return value as Route;
}

function actionFeedbackPath(key: "actionError" | "actionSuccess", code: string, returnTo: Route = "/") {
  const safeReturnTo = getSafeInternalPath(returnTo);
  const [path, hash = ""] = safeReturnTo.split("#");
  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}${key}=${code}${hash ? `#${hash}` : ""}` as Route;
}

export function getActionErrorMessage(code: string | undefined) {
  if (!code || !(code in actionErrorMessages)) {
    return undefined;
  }

  return actionErrorMessages[code as ActionErrorCode];
}

export function getActionSuccessMessage(code: string | undefined) {
  if (!code || !(code in actionSuccessMessages)) {
    return undefined;
  }

  return actionSuccessMessages[code as ActionSuccessCode];
}

export function actionErrorPath(code: ActionErrorCode, returnTo: Route = "/") {
  return actionFeedbackPath("actionError", code, returnTo);
}

export function actionSuccessPath(code: ActionSuccessCode, returnTo = "/") {
  return actionFeedbackPath("actionSuccess", code, getSafeInternalPath(returnTo));
}
