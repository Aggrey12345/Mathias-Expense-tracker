/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { signIn } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signIn();
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 relative z-10 text-center"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center mx-auto shadow-2xl border border-white/20">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">SpendWise</h1>
            <p className="text-indigo-100 font-medium opacity-80 italic">Finance, simplified.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
             <h2 className="text-xl font-bold">Start Tracking Now</h2>
             <p className="text-sm text-indigo-100/70 leading-relaxed max-w-[280px] mx-auto">
               Join thousands of people who manage their expenses intelligently.
             </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-white text-indigo-600 py-5 rounded-[24px] font-bold text-lg shadow-2xl hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <LogIn className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            Continue with Google
          </button>
        </div>

        <p className="text-[10px] text-indigo-200/50 uppercase font-black tracking-[0.2em]">
          Powered by Google Cloud & AI Studio
        </p>
      </motion.div>
    </div>
  );
}
