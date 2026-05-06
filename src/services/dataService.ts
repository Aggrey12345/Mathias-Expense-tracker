/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Transaction, Budget, UserProfile } from '../types';

const TRANSACTIONS_COLLECTION = 'transactions';
const BUDGETS_COLLECTION = 'budgets';
const USERS_COLLECTION = 'users';

export const TransactionService = {
  subscribeToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(transactions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_COLLECTION);
    });
  },

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    try {
      await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...transaction,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, TRANSACTIONS_COLLECTION);
    }
  },

  async updateTransaction(id: string, data: Partial<Transaction>) {
    const path = `${TRANSACTIONS_COLLECTION}/${id}`;
    try {
      await updateDoc(doc(db, TRANSACTIONS_COLLECTION, id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteTransaction(id: string) {
    const path = `${TRANSACTIONS_COLLECTION}/${id}`;
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

export const BudgetService = {
  subscribeToBudgets(userId: string, callback: (budgets: Budget[]) => void) {
    const q = query(
      collection(db, BUDGETS_COLLECTION),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Budget[];
      callback(budgets);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, BUDGETS_COLLECTION);
    });
  },

  async saveBudget(budget: Omit<Budget, 'id'>) {
    try {
      // Use category as ID for simplicity or just addDoc
      await addDoc(collection(db, BUDGETS_COLLECTION), {
        ...budget,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, BUDGETS_COLLECTION);
    }
  },

  async deleteBudget(id: string) {
    const path = `${BUDGETS_COLLECTION}/${id}`;
    try {
      await deleteDoc(doc(db, BUDGETS_COLLECTION, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

export const UserService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const path = `${USERS_COLLECTION}/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createProfile(profile: UserProfile) {
    const path = `${USERS_COLLECTION}/${profile.uid}`;
    try {
      await setDoc(doc(db, USERS_COLLECTION, profile.uid), {
        ...profile,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
