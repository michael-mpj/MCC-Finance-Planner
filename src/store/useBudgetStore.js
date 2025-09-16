import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],
      
      addBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            { ...budget, id: Date.now(), createdAt: new Date().toISOString() }
          ],
        })),
        
      updateBudget: (id, updates) =>
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updates } : budget
          ),
        })),
        
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        })),
    }),
    {
      name: "mcc-budget-storage",
    }
  )
);
