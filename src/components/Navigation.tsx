/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, ReceiptText, PieChart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Navigation() {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/transactions', icon: ReceiptText, label: 'History' },
    { to: '/reports', icon: PieChart, label: 'Stats' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-full md:border-r md:border-t-0 md:px-0 md:py-8">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
            )
          }
        >
          <Icon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
