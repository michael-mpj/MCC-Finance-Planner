import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import {
  saveTransactionToFirebase,
  saveTransactionsToFirebase,
  deleteTransactionFromFirebase,
} from "../services/firebase";

export const useTransactionStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        transactions: [],
        categories: [
          "Food & Dining",
          "Transportation",
          "Shopping",
          "Entertainment",
          "Bills & Utilities",
          "Healthcare",
          "Travel",
          "Education",
          "Business",
          "Personal Care",
          "Gifts & Donations",
          "Investment",
          "Salary",
          "Freelance",
          "Other Income",
          "Other Expense",
        ],
        isLoading: false,
        lastSync: null,
        syncToFirebase: null,

        addTransaction: (transaction) => {
          const newTransaction = {
            ...transaction,
            id: transaction.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: transaction.title || transaction.note || transaction.category || "Untitled",
            description: transaction.description || transaction.note || "",
            createdAt: transaction.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            transactions: [...state.transactions, newTransaction],
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.(newTransaction, "add");

          return newTransaction;
        },

        addTransactions: (transactions) => {
          const newTransactions = transactions.map((tx) => ({
            ...tx,
            id: tx.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: tx.title || tx.note || tx.category || "Untitled",
            description: tx.description || tx.note || "",
            createdAt: tx.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imported: true,
          }));

          set((state) => ({
            transactions: [...state.transactions, ...newTransactions],
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.(newTransactions, "batch_add");

          return newTransactions;
        },

        updateTransaction: (id, updates) => {
          const updatedTransaction = {
            ...updates,
            id,
            title: updates.title || updates.note || updates.category || "Untitled",
            description: updates.description || updates.note || "",
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.id === id ? { ...tx, ...updatedTransaction } : tx
            ),
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.(updatedTransaction, "update");

          return updatedTransaction;
        },

        deleteTransaction: (id) => {
          set((state) => ({
            transactions: state.transactions.filter((tx) => tx.id !== id),
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.({ id }, "delete");
        },

        deleteTransactions: (ids) => {
          set((state) => ({
            transactions: state.transactions.filter((tx) => !ids.includes(tx.id)),
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.(ids, "batch_delete");
        },

        clearAllTransactions: () => {
          set(() => ({
            transactions: [],
            lastSync: new Date().toISOString(),
          }));

          get().syncToFirebase?.([], "clear_all");
        },

        getTransactionsByDateRange: (startDate, endDate) => {
          const transactions = get().transactions;
          return transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate >= new Date(startDate) && txDate <= new Date(endDate);
          });
        },

        getTransactionsByCategory: (category) => {
          const transactions = get().transactions;
          return transactions.filter((tx) => tx.category === category);
        },

        getTransactionsByType: (type) => {
          const transactions = get().transactions;
          return transactions.filter((tx) => tx.type === type);
        },

        getTotalByCategory: () => {
          const transactions = get().transactions;
          return transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
            return acc;
          }, {});
        },

        getTotalByType: () => {
          const transactions = get().transactions;
          const income = transactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
          const expenses = transactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

          return { income, expenses, net: income - expenses };
        },

        getRecentTransactions: (limit = 10) => {
          const transactions = get().transactions;
          return transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
        },

        setFirebaseSync: (syncFunction) => {
          set({ syncToFirebase: syncFunction });
        },

        initializeFirebaseSync: () => {
          const user = useAuthStore.getState().user;
          if (!user) return;

          const syncFunction = async (data, operation) => {
            try {
              switch (operation) {
                case "add":
                  await saveTransactionToFirebase(user.uid, data);
                  break;
                case "batch_add":
                  await saveTransactionsToFirebase(user.uid, data);
                  break;
                case "update":
                  await saveTransactionToFirebase(user.uid, data);
                  break;
                case "delete":
                  await deleteTransactionFromFirebase(user.uid, data.id);
                  break;
                case "batch_delete":
                  for (const id of data) {
                    await deleteTransactionFromFirebase(user.uid, id);
                  }
                  break;
                case "clear_all":
                  break;
                default:
                  break;
              }
            } catch {
              set({ syncToFirebase: syncFunction });
            }
          };

          set({ syncToFirebase: syncFunction });
        },

        setLoading: (loading) => {
          set(() => ({ isLoading: loading }));
        },

        addCategory: (category) => {
          set((state) => ({
            categories: [...new Set([...state.categories, category])],
          }));
        },

        removeCategory: (category) => {
          set((state) => ({
            categories: state.categories.filter((cat) => cat !== category),
          }));
        },

        updateLastSync: () => {
          set(() => ({ lastSync: new Date().toISOString() }));
        },

        getMonthlyStats: (year, month) => {
          const transactions = get().transactions;
          const monthlyTx = transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate.getFullYear() === year && txDate.getMonth() === month;
          });

          const income = monthlyTx
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

          const expenses = monthlyTx
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

          return {
            income,
            expenses,
            net: income - expenses,
            count: monthlyTx.length,
            transactions: monthlyTx,
          };
        },
      }),
      {
        name: "mcc-transactions-storage",
        partialize: (state) => ({
          transactions: state.transactions,
          categories: state.categories,
          lastSync: state.lastSync,
        }),
      }
    )
  )
);

useTransactionStore.subscribe(
  (state) => state.transactions,
  (transactions, previousTransactions) => {
    if (import.meta.env.DEV && transactions.length !== previousTransactions.length) {
      // transactions count changed
    }

    globalThis.dispatchEvent(
      new CustomEvent("transactionsUpdated", {
        detail: {
          transactions,
          previousCount: previousTransactions.length,
          currentCount: transactions.length,
        },
      })
    );
  }
);
