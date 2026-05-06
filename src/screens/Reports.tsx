/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { TransactionService } from '../services/dataService';
import { Transaction } from '../types';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function Reports() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [range, setRange] = useState<'month' | 'all'>('month');

  useEffect(() => {
    if (!user) return;
    return TransactionService.subscribeToTransactions(user.uid, setTransactions);
  }, [user]);

  const filtered = transactions.filter(t => {
    if (range === 'all') return true;
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return isWithinInterval(new Date(t.date), { start, end });
  });

  const expenseByCategory = filtered
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = CATEGORIES.find(c => c.id === t.category);
      const name = cat?.name || 'Other';
      acc[name] = (acc[name] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
    color: CATEGORIES.find(c => c.name === name)?.color || '#6B7280'
  }));

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'MMM dd');
  }).reverse();

  const barData = last7Days.map(dateStr => {
    const daily = transactions.filter(t => format(new Date(t.date), 'MMM dd') === dateStr);
    return {
      name: dateStr,
      income: daily.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: daily.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    };
  });

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-400 font-medium">Spending insights</p>
      </header>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button 
          onClick={() => setRange('month')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          This Month
        </button>
        <button 
          onClick={() => setRange('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          All Time
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Expense Distribution</h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">
              No data for this period
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-gray-600 truncate">{item.name}</span>
                <span className="text-xs font-bold text-gray-900 ml-auto">{CURRENCY_SYMBOL}{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Activity (Last 7 Days)</h3>
          <div className="h-64 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
