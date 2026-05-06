/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { TransactionService } from '../services/dataService';
import { Transaction } from '../types';
import TransactionCard from '../components/TransactionCard';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    return TransactionService.subscribeToTransactions(user.uid, setTransactions);
  }, [user]);

  useEffect(() => {
    let result = transactions;
    if (search) {
      result = result.filter(t => 
        t.category.toLowerCase().includes(search.toLowerCase()) || 
        t.note?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTransactions(result);
  }, [search, transactions]);

  const groupedByDate = filteredTransactions.reduce((acc, t) => {
    const date = format(new Date(t.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-400 font-medium">Your financial footprint</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-[20px] shadow-sm focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-gray-900 placeholder:text-gray-300"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([date, dailyTransactions]: [string, Transaction[]]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4 px-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {format(new Date(date), 'MMMM dd, yyyy')}
                </h3>
              </div>
              <div className="space-y-1">
                {dailyTransactions.map((t: Transaction) => (
                  <TransactionCard key={t.id} transaction={t} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
