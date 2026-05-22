import { InvitationDraft, defaultDraft } from "./invitation";

const STORAGE_KEY = "invitation-creator-pro:v1";

export function loadDraft(): InvitationDraft {
  if (typeof window === "undefined") {
    return defaultDraft;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultDraft;
    }

    return {
      ...defaultDraft,
      ...JSON.parse(raw),
      sections: {
        ...defaultDraft.sections,
        ...JSON.parse(raw).sections
      }
    };
  } catch {
    return defaultDraft;
  }
}

export function saveDraft(draft: InvitationDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}
