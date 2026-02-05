import {useCallback, useEffect, useState} from "react";
import {STORAGE_KEY} from "./lifeDotsData";
import {
  DEFAULT_PROFILE_STATE,
  ProfileState,
  loadStoredProfile,
  toProfileState,
  toStoredProfile
} from "./profile";

export function useProfileState() {
  const [profileState, setProfileState] = useState<ProfileState>(DEFAULT_PROFILE_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadStoredProfile(window.localStorage);
    const nextState = toProfileState(stored);
    setProfileState(nextState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStoredProfile(nextState)));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStoredProfile(profileState)));
  }, [profileState, hasHydrated]);

  const updateProfile = useCallback((patch: Partial<ProfileState>) => {
    setProfileState((prev) => ({...prev, ...patch}));
  }, []);

  return {profileState, setProfileState, updateProfile, hasHydrated};
}
