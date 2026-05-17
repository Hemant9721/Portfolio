import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Cat } from 'lucide-react';
import AdminLogin from '../admin/AdminLogin';
import useAdminStore from '../../store/adminStore';

export default function Footer() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAdmin } = useAdminStore();

  const year = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-[rgba(124,58,237,0.12)] py-10 px-6 relative">
        {/* Subtle gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 50%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5 font-display font-bold text-lg">
            <div className="w-8 h-8 rounded-xl bg-[#0d0d14] border border-purple-500/25 flex items-center justify-center"
              style={{ boxShadow: '0 0 14px rgba(124,58,237,0.3)' }}>
              <Cat size={18} className="text-[#a78bfa]" />
            </div>
            <span className="gradient-text">HS</span>
          </div>

          {/* Credit */}
          <p className="text-gray-600 text-sm flex items-center gap-1.5 order-last md:order-none">
            Built with <Heart size={12} className="text-red-400/80 fill-red-400/80" /> by{' '}
            <span className="text-gray-400 font-medium">Hemant Soni</span>
            <span className="text-gray-700 mx-1">·</span>
            © {year}
          </p>

          {/* Admin trigger — subtle, in the corner */}
          <button
            onClick={() => !isAdmin && setShowLogin(true)}
            title={isAdmin ? 'Admin mode active' : 'Admin login'}
            className={`flex items-center gap-1.5 text-xs font-mono transition-all px-3 py-1.5 rounded-lg ${
              isAdmin
                ? 'text-[#7c3aed] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] cursor-default'
                : 'text-gray-700 hover:text-gray-400 hover:bg-white/5 border border-transparent cursor-pointer'
            }`}
          >
            <Lock size={11} />
            {isAdmin ? 'Admin Mode' : 'Admin'}
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
    </>
  );
}
