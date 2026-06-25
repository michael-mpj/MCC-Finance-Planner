const STORAGE_KEYS = {
  TRANSACTIONS: "finance-transactions",
  BUDGETS: "finance-budgets",
  SETTINGS: "finance-settings",
};

export const storage = {
  getTransactions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setTransactions: (transactions) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setBudgets: (budgets) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  setSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  hasStoredData: () => {
    return (
      localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) !== null ||
      localStorage.getItem(STORAGE_KEYS.BUDGETS) !== null
    );
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

export default storage;
