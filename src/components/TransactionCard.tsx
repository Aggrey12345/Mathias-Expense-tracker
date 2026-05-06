/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Transaction } from '../types';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const category = CATEGORIES.find(c => c.id === transaction.category) || CATEGORIES[CATEGORIES.length - 1];
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon] || Icons.HelpCircle;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${category.color}15`, color: category.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{category.name}</h4>
          {transaction.note && <p className="text-sm text-gray-500 truncate max-w-[150px]">{transaction.note}</p>}
          <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-bold text-lg",
          transaction.type === 'income' ? "text-emerald-600" : "text-gray-900"
        )}>
          {transaction.type === 'income' ? '+' : '-'}{CURRENCY_SYMBOL}{transaction.amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
