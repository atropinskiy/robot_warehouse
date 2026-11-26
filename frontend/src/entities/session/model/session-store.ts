import { create } from "zustand";
import { getMe, type UserEntity } from "@/shared/api";

export type SessionStatus =
  "idle" | "loading" | "authenticated" | "unauthenticated";

interface SessionState {
  user: UserEntity | null;
  status: SessionStatus;
  /** Проверяет сессию на старте приложения (GET /auth/me). */
  init: () => Promise<void>;
  setUser: (user: UserEntity) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  status: "idle",

  init: async () => {
    set({ status: "loading" });
    try {
      const user = await getMe();
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  setUser: (user) => set({ user, status: "authenticated" }),

  clear: () => set({ user: null, status: "unauthenticated" }),
}));
