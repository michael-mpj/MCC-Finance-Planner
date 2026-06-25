import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
}

let cachedApp = null;
function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (cachedApp) return cachedApp;
  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }
  cachedApp = initializeApp(firebaseConfig);
  return cachedApp;
}

let cachedAuth = null;
let cachedDb = null;
let cachedProvider = null;

function getAuthInstance() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedAuth) cachedAuth = getAuth(app);
  return cachedAuth;
}

function getDbInstance() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedDb) cachedDb = getFirestore(app);
  return cachedDb;
}

function getProviderInstance() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedProvider) cachedProvider = new GoogleAuthProvider();
  return cachedProvider;
}

export {
  isFirebaseConfigured,
  getFirebaseApp,
  getAuthInstance,
  getDbInstance,
  getProviderInstance,
};

export const signInWithGoogle = async () => {
  const auth = getAuthInstance();
  const provider = getProviderInstance();
  if (!auth || !provider) throw new Error("Firebase is not configured");
  const result = await signInWithPopup(auth, provider);
  return {
    success: true,
    user: result.user,
    credential: result.credential,
  };
};

export const signInWithEmail = async (email, password) => {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase is not configured");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return {
    success: true,
    user: result.user,
  };
};

export const signInDemo = async () => {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase is not configured");
  const result = await signInAnonymously(auth);
  return {
    success: true,
    user: result.user,
    isDemo: true,
  };
};

export const logOut = async () => {
  const auth = getAuthInstance();
  if (!auth) return { success: true };
  await signOut(auth);
  return { success: true };
};

export const listenToAuthChanges = (callback) => {
  const auth = getAuthInstance();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const saveTransactionToFirebase = async (userId, transaction) => {
  const db = getDbInstance();
  if (!db) return;
  const docRef = doc(db, "users", userId, "transactions", transaction.id);
  await setDoc(docRef, {
    ...transaction,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const saveTransactionsToFirebase = async (userId, transactions) => {
  const db = getDbInstance();
  if (!db) return;
  const batch = [];
  for (const tx of transactions) {
    const docRef = doc(db, "users", userId, "transactions", tx.id);
    batch.push(
      setDoc(docRef, {
        ...tx,
        userId,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    );
  }
  await Promise.all(batch);
};

export const getTransactionsFromFirebase = async (userId) => {
  const db = getDbInstance();
  if (!db) return [];
  const q = query(
    collection(db, "users", userId, "transactions"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteTransactionFromFirebase = async (userId, transactionId) => {
  const db = getDbInstance();
  if (!db) return;
  const docRef = doc(db, "users", userId, "transactions", transactionId);
  await deleteDoc(docRef);
};

export const listenToTransactions = (userId, callback) => {
  const db = getDbInstance();
  if (!db) return () => {};
  const q = query(
    collection(db, "users", userId, "transactions"),
    orderBy("date", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(transactions);
  });
};

export const saveBudgetToFirebase = async (userId, budget) => {
  const db = getDbInstance();
  if (!db) return;
  const docRef = doc(db, "users", userId, "budgets", budget.id);
  await setDoc(docRef, {
    ...budget,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const getBudgetsFromFirebase = async (userId) => {
  const db = getDbInstance();
  if (!db) return [];
  const q = query(collection(db, "users", userId, "budgets"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteBudgetFromFirebase = async (userId, budgetId) => {
  const db = getDbInstance();
  if (!db) return;
  const docRef = doc(db, "users", userId, "budgets", budgetId);
  await deleteDoc(docRef);
};
