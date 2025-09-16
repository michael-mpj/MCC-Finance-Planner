import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [
        "Food & Dining", "Transportation", "Shopping", "Entertainment",
        "Bills & Utilities", "Healthcare", "Travel", "Education",
        "Business", "Personal Care", "Gifts & Donations", "Investment"
      ],
      
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: Date.now(), createdAt: new Date().toISOString() }
          ],
        })),
        
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
        
      getTransactionsByDateRange: (startDate, endDate) => {
        const transactions = get().transactions;
        return transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate >= new Date(startDate) && txDate <= new Date(endDate);
        });
      },
      
      getTotalByCategory: () => {
        const transactions = get().transactions;
        return transactions.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
          return acc;
        }, {});
      },
    }),
    {
      name: "mcc-transactions-storage",
    }
  )
);
