import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {Session} from "@supabase/supabase-js";
import type {Profile} from "./lifeDotsData";
import {getRedirectUrl} from "./appUrl";
import {getSupabaseClient} from "./supabaseClient";
import {AUTH_TOKEN_COOKIE} from "./authConstants";

type UseSupabaseAuthOptions = {
  redirectPath: string;
  fetchProfile?: boolean;
};

type AuthState = {
  supabase: ReturnType<typeof getSupabaseClient>;
  session: Session | null;
  userId: string | null;
  email: string | null;
  hasAccess: boolean;
  profile: Profile | null;
  isLoading: boolean;
  profileLoaded: boolean;
  refreshProfile: (userId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

function setAuthTokenCookie(session: Session | null) {
  if (typeof document === "undefined") return;

  if (!session?.access_token) {
    document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const maxAge = Math.max((session.expires_at ?? now + 3600) - now, 60);
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(session.access_token)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
    isSecure ? "Secure" : ""
  ]
    .filter(Boolean)
    .join("; ");
}

export function useSupabaseAuth({
  redirectPath,
  fetchProfile = false
}: UseSupabaseAuthOptions): AuthState {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const isActiveRef = useRef(true);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setHasAccess(false);
    setProfile(null);
    setProfileLoaded(false);
    setAuthTokenCookie(null);
  }, []);

  const refreshProfile = useCallback(
    async (userId: string) => {
      if (!supabase || !isActiveRef.current) {
        setHasAccess(false);
        setProfile(null);
        setProfileLoaded(false);
        return;
      }

      setProfileLoaded(false);
      try {
        if (fetchProfile) {
          const {data, error} = await supabase
            .from("profiles")
            .select("has_access, profile")
            .eq("id", userId)
            .maybeSingle();

          if (!isActiveRef.current) return;
          if (error) {
            setHasAccess(false);
            setProfile(null);
            setProfileLoaded(true);
            return;
          }

          setHasAccess(Boolean(data?.has_access));
          setProfile((data?.profile ?? null) as Profile | null);
          setProfileLoaded(true);
          return;
        }

        const {data, error} = await supabase
          .from("profiles")
          .select("has_access")
          .eq("id", userId)
          .maybeSingle();

        if (!isActiveRef.current) return;
        if (error) {
          setHasAccess(false);
          setProfile(null);
          setProfileLoaded(true);
          return;
        }

        setHasAccess(Boolean(data?.has_access));
        setProfile(null);
        setProfileLoaded(true);
      } catch (err) {
        if (!isActiveRef.current) return;
        setHasAccess(false);
        setProfile(null);
        setProfileLoaded(true);
      }
    },
    [fetchProfile, supabase]
  );

  useEffect(() => {
    let isActive = true;
    isActiveRef.current = true;
    if (!supabase) {
      setIsLoading(false);
      return () => {
        isActive = false;
        isActiveRef.current = false;
      };
    }

    const loadSession = async () => {
      try {
        const {data, error} = await supabase.auth.getSession();
        if (!isActive) return;
        if (error) {
          clearAuthState();
          setIsLoading(false);
          return;
        }

        setSession(data.session);
        setAuthTokenCookie(data.session ?? null);
        setIsLoading(false);
        if (data.session?.user?.id) {
          void refreshProfile(data.session.user.id);
        } else {
          setHasAccess(false);
          setProfile(null);
          setProfileLoaded(false);
        }
      } catch (err) {
        if (!isActive) return;
        if (err instanceof DOMException && err.name === "AbortError") {
          setIsLoading(false);
          return;
        }
        clearAuthState();
        setIsLoading(false);
      }
    };

    const {data} = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        try {
          setSession(nextSession);
          setAuthTokenCookie(nextSession);
          setIsLoading(false);
          if (nextSession?.user?.id) {
            void refreshProfile(nextSession.user.id);
          } else {
            clearAuthState();
          }
        } catch (err) {
          if (!isActive) return;
          if (err instanceof DOMException && err.name === "AbortError") {
            setIsLoading(false);
            return;
          }
          clearAuthState();
          setIsLoading(false);
        }
      }
    );

    void loadSession();
    return () => {
      isActive = false;
      isActiveRef.current = false;
      const subscription =
        data && "subscription" in data ? data.subscription : data;
      subscription?.unsubscribe?.();
    };
  }, [clearAuthState, refreshProfile, supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    const redirectTo = getRedirectUrl(redirectPath);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? {redirectTo} : undefined
    });
  }, [redirectPath, supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } finally {
      // Always clear local auth state even if remote sign-out fails
      // (for example after hard-deleting the user server-side).
      clearAuthState();
    }
  }, [clearAuthState, supabase]);

  return {
    supabase,
    session,
    userId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    hasAccess,
    profile,
    isLoading,
    profileLoaded,
    refreshProfile,
    signInWithGoogle,
    signOut
  };
}
