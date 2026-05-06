/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { TransactionService } from '../services/dataService';
import { Transaction } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import TransactionCard from '../components/TransactionCard';
import { Plus, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 });

  useEffect(() => {
    if (!user) return;

    const unsubscribe = TransactionService.subscribeToTransactions(user.uid, (data) => {
      setRecentTransactions(data.slice(0, 5));
      
      const totalIncome = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      setStats({
        balance: totalIncome - totalExpense,
        income: totalIncome,
        expense: totalExpense
      });
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">Welcome back!</p>
          <h1 className="text-2xl font-bold text-gray-900">{user?.displayName || 'User'}</h1>
        </div>
        <Link 
          to="/add" 
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      {/* Balance Card */}
      <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl" />
        <div className="relative z-10">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Total Balance</p>
          <h2 className="text-4xl font-black mb-8">{CURRENCY_SYMBOL}{stats.balance.toLocaleString()}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-emerald-400 p-1 rounded-full text-emerald-900">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Income</span>
              </div>
              <p className="font-bold text-lg">{CURRENCY_SYMBOL}{stats.income.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-rose-400 p-1 rounded-full text-rose-900">
                  <ArrowDownRight className="w-3 h-3" />
                </div>
                <span className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Expenses</span>
              </div>
              <p className="font-bold text-lg text-rose-50) opacity-90">{CURRENCY_SYMBOL}{stats.expense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <Link to="/transactions" className="text-indigo-600 text-sm font-semibold hover:underline">View All</Link>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {recentTransactions.map((t: Transaction) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-400">Start by adding your first expense or income.</p>
          </div>
        )}
      </div>
    </div>
  );
}
