import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signInWithEmail,
  signInDemo,
  logOut,
  listenToAuthChanges,
} from "../services/firebase";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      authError: null,
      isDemoMode: false,
      firebaseReady: false,

      initializeAuth: async () => {
        set({ isLoading: true, error: null, authError: null });
        try {
          if (isFirebaseConfigured()) {
            const unsubscribe = listenToAuthChanges((firebaseUser) => {
              if (firebaseUser) {
                const normalizedUser = {
                  id: firebaseUser.uid,
                  uid: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                  email: firebaseUser.email,
                  photoURL: firebaseUser.photoURL,
                  isAnonymous: firebaseUser.isAnonymous,
                };
                set({
                  user: normalizedUser,
                  isAuthenticated: true,
                  isDemoMode: firebaseUser.isAnonymous,
                  isLoading: false,
                  firebaseReady: true,
                });
              } else {
                const storedTransactions = localStorage.getItem("finance-transactions");
                const storedBudgets = localStorage.getItem("finance-budgets");
                const hasUserData = storedTransactions || storedBudgets;

                if (hasUserData) {
                  set({
                    user: { id: "local-user", name: "Local User", email: "privacy@localhost" },
                    isAuthenticated: true,
                    isDemoMode: true,
                    isLoading: false,
                    firebaseReady: true,
                  });
                } else {
                  set({
                    user: null,
                    isAuthenticated: false,
                    isDemoMode: true,
                    isLoading: false,
                    firebaseReady: true,
                  });
                }
              }
            });

            get().setFirebaseUnsubscribe?.(unsubscribe);
          } else {
            const storedTransactions = localStorage.getItem("finance-transactions");
            const storedBudgets = localStorage.getItem("finance-budgets");
            const hasUserData = storedTransactions || storedBudgets;

            if (hasUserData) {
              set({
                user: { id: "local-user", name: "Local User", email: "privacy@localhost" },
                isAuthenticated: true,
                isDemoMode: true,
                isLoading: false,
                firebaseReady: false,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isDemoMode: true,
                isLoading: false,
                firebaseReady: false,
              });
            }
          }
        } catch {
          const storedTransactions = localStorage.getItem("finance-transactions");
          const storedBudgets = localStorage.getItem("finance-budgets");
          const hasUserData = storedTransactions || storedBudgets;

          if (hasUserData) {
            set({
              user: { id: "local-user", name: "Local User", email: "privacy@localhost" },
              isAuthenticated: true,
              isDemoMode: true,
              isLoading: false,
              firebaseReady: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isDemoMode: true,
              isLoading: false,
              firebaseReady: false,
            });
          }
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null, authError: null });
        try {
          if (!isFirebaseConfigured()) {
            throw new Error("Firebase is not configured");
          }
          const result = await signInWithGoogle();
          const normalizedUser = {
            id: result.user.uid,
            uid: result.user.uid,
            name: result.user.displayName || result.user.email,
            email: result.user.email,
            photoURL: result.user.photoURL,
            isAnonymous: false,
          };
          set({
            user: normalizedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
            firebaseReady: true,
          });
          return { success: true, user: normalizedUser };
        } catch {
          const errorMessage = "Google sign-in failed";
          set({
            error: errorMessage,
            authError: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null, authError: null });
        try {
          if (!isFirebaseConfigured()) {
            throw new Error("Firebase is not configured");
          }
          const result = await signInWithEmail(email, password);
          const normalizedUser = {
            id: result.user.uid,
            uid: result.user.uid,
            name: result.user.displayName || result.user.email,
            email: result.user.email,
            photoURL: result.user.photoURL,
            isAnonymous: false,
          };
          set({
            user: normalizedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
            firebaseReady: true,
          });
          return { success: true, user: normalizedUser };
        } catch {
          const errorMessage = "Email sign-in failed";
          set({
            error: errorMessage,
            authError: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      signInDemo: async () => {
        set({ isLoading: true, error: null, authError: null });
        try {
          if (!isFirebaseConfigured()) {
            const localUser = {
              id: "local-user",
              name: "Local User",
              email: "privacy@localhost",
            };
            set({
              user: localUser,
              isAuthenticated: true,
              isDemoMode: true,
              isLoading: false,
              firebaseReady: false,
            });
            return { success: true, user: localUser };
          }
          const result = await signInDemo();
          const normalizedUser = {
            id: result.user.uid,
            uid: result.user.uid,
            name: "Demo User",
            email: result.user.email || "demo@localhost",
            isAnonymous: true,
          };
          set({
            user: normalizedUser,
            isAuthenticated: true,
            isDemoMode: true,
            isLoading: false,
            firebaseReady: true,
          });
          return { success: true, user: normalizedUser };
        } catch {
          const localUser = {
            id: "local-user",
            name: "Local User",
            email: "privacy@localhost",
          };
          set({
            user: localUser,
            isAuthenticated: true,
            isDemoMode: true,
            isLoading: false,
            firebaseReady: false,
          });
          return { success: true, user: localUser };
        }
      },

      login: async (credentials) => {
        if (credentials.email && credentials.password) {
          return get().loginWithEmail(credentials.email, credentials.password);
        }
        const errorMessage = "Invalid credentials";
        set({ error: errorMessage, authError: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          if (get().firebaseReady) {
            await logOut();
          }
        } catch {
          // ignore
        }
        set({
          user: null,
          isAuthenticated: false,
          isDemoMode: true,
          isLoading: false,
          error: null,
          authError: null,
          firebaseReady: false,
        });
      },

      clearError: () => {
        set({ error: null, authError: null });
      },

      setFirebaseUnsubscribe: (unsubscribe) => {
        get()._firebaseUnsubscribe = unsubscribe;
      },
    }),
    {
      name: "finance-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
        firebaseReady: state.firebaseReady,
      }),
    }
  )
);

export const getCurrentUser = () => useAuthStore.getState().user;
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;

export { useAuthStore };
