import {useCallback, useEffect, useState} from "react";
import type {ProfileState} from "./profile";

export function useDraftProfile(profileState: ProfileState, isOpen: boolean) {
  const [draft, setDraft] = useState<ProfileState>(profileState);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(profileState);
  }, [isOpen, profileState]);

  const updateDraft = useCallback((patch: Partial<ProfileState>) => {
    setDraft((prev) => ({...prev, ...patch}));
  }, []);

  return {draft, setDraft, updateDraft};
}
