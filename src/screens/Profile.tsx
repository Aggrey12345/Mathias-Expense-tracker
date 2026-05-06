/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { signOut } from '../lib/firebase';
import { CURRENCY_SYMBOL, CURRENCY } from '../constants';
import { LogOut, Bell, CreditCard, Shield, HelpCircle, ChevronRight, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: CreditCard, label: 'Payment Methods', color: 'text-indigo-500' },
    { icon: Bell, label: 'Notifications', color: 'text-rose-500' },
    { icon: Shield, label: 'Security', color: 'text-emerald-500' },
    { icon: HelpCircle, label: 'Support', color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-400 font-medium">Manage your settings</p>
      </header>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-[32px] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mb-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-10 h-10 text-indigo-200" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user?.displayName || 'User'}</h2>
        <p className="text-sm text-gray-400 font-medium mb-6">{user?.email}</p>
        
        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Currency</p>
            <p className="font-bold text-gray-900">{profile?.currency || CURRENCY} ({CURRENCY_SYMBOL})</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Language</p>
            <p className="font-bold text-gray-900">English</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
        {menuItems.map((item, index) => (
          <button 
            key={item.label}
            className={`w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <div className={`p-2 rounded-xl bg-gray-50 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-700">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-rose-50 text-rose-600 py-5 rounded-[24px] font-bold text-lg hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-6 h-6" />
        Log Out
      </button>
    </div>
  );
}
