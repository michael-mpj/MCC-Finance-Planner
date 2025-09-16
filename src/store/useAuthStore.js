import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "mcc-auth-storage",
    }
  )
);
