import {useCallback, useEffect, useMemo, useState} from "react";
import type {Session} from "@supabase/supabase-js";
import type {Profile} from "./lifeDotsData";
import {getSupabaseClient} from "./supabaseClient";

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

  const clearAuthState = useCallback(() => {
    setSession(null);
    setHasAccess(false);
    setProfile(null);
    setProfileLoaded(false);
  }, []);

  const refreshProfile = useCallback(
    async (userId: string) => {
      if (!supabase) {
        setHasAccess(false);
        setProfile(null);
        setProfileLoaded(false);
        return;
      }

      setProfileLoaded(false);
      if (fetchProfile) {
        const {data, error} = await supabase
          .from("profiles")
          .select("has_access, profile")
          .eq("id", userId)
          .maybeSingle();

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

      if (error) {
        setHasAccess(false);
        setProfile(null);
        setProfileLoaded(true);
        return;
      }

      setHasAccess(Boolean(data?.has_access));
      setProfile(null);
      setProfileLoaded(true);
    },
    [fetchProfile, supabase]
  );

  useEffect(() => {
    let isActive = true;
    if (!supabase) {
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    const loadSession = async () => {
      const {data, error} = await supabase.auth.getSession();
      if (!isActive) return;
      if (error) {
        clearAuthState();
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      if (data.session?.user?.id) {
        await refreshProfile(data.session.user.id);
      } else {
        setHasAccess(false);
        setProfile(null);
        setProfileLoaded(false);
      }
      setIsLoading(false);
    };

    const {data: subscription} = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user?.id) {
          await refreshProfile(nextSession.user.id);
        } else {
          clearAuthState();
        }
      }
    );

    void loadSession();
    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, [clearAuthState, refreshProfile, supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${redirectPath}`
        : undefined;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? {redirectTo} : undefined
    });
  }, [redirectPath, supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    clearAuthState();
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
