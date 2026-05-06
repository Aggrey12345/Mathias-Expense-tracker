/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', type: 'expense', color: '#EF4444' },
  { id: 'transport', name: 'Transport', icon: 'Car', type: 'expense', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: '#F59E0B' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'FileText', type: 'expense', color: '#8B5CF6' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', type: 'expense', color: '#EC4899' },
  { id: 'health', name: 'Health', icon: 'Activity', type: 'expense', color: '#10B981' },
  { id: 'income', name: 'Salary', icon: 'Wallet', type: 'income', color: '#10B981' },
  { id: 'gift', name: 'Gift', icon: 'Gift', type: 'income', color: '#F59E0B' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', type: 'expense', color: '#6B7280' },
];

export const CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';
