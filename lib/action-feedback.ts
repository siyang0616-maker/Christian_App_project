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
} as const;

export type ActionErrorCode = keyof typeof actionErrorMessages;

export function getActionErrorMessage(code: string | undefined) {
  if (!code || !(code in actionErrorMessages)) {
    return undefined;
  }

  return actionErrorMessages[code as ActionErrorCode];
}

export function actionErrorPath(code: ActionErrorCode) {
  return `/?actionError=${code}` as Route;
}
