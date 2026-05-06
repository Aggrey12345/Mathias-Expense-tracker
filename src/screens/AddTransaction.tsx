/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { TransactionService } from '../services/dataService';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AddTransaction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      await TransactionService.addTransaction({
        userId: user.uid,
        amount: parseFloat(amount),
        type,
        category,
        note,
        date: new Date(date).toISOString(),
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = CATEGORIES.filter(c => c.type === type);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Add Transaction</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        {/* Toggle Type */}
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory(CATEGORIES.find(c => c.type === 'expense')?.id || '');
            }}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
              type === 'expense' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory(CATEGORIES.find(c => c.type === 'income')?.id || '');
            }}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
              type === 'income' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            )}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">{CURRENCY_SYMBOL}</span>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white border-0 rounded-[32px] py-10 px-14 text-5xl font-black text-gray-900 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-100"
            autoFocus
            required
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:ring-4 focus:ring-indigo-100 transition-all"
            required
          />
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Category</label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map((c) => {
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[c.icon] || Icons.HelpCircle;
              const isActive = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                    isActive ? "border-indigo-600 bg-indigo-50" : "border-transparent bg-white hover:border-gray-100"
                  )}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: isActive ? 'transparent' : `${c.color}15`, color: c.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-[10px] font-bold text-center leading-tight truncate w-full", isActive ? "text-indigo-600" : "text-gray-500")}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Note (Optional)</label>
          <textarea
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:ring-4 focus:ring-indigo-100 transition-all min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-6 h-6" />
              Save Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}
