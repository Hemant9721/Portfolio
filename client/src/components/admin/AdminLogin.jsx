import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import toast from 'react-hot-toast';

export default function AdminLogin({ onClose }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAdminStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      toast.success('Welcome back, Admin!');
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
        className="gradient-border rounded-2xl w-full max-w-sm overflow-hidden"
        style={{ background: '#0a0a12' }}
      >
        {/* Decorative top accent */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)' }} />

        <div className="p-8">
          <button onClick={onClose}
            className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ boxShadow: ['0 0 16px rgba(124,58,237,0.4)', '0 0 32px rgba(124,58,237,0.2)', '0 0 16px rgba(124,58,237,0.4)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center mx-auto mb-5"
            >
              <Shield size={24} className="text-[#a78bfa]" />
            </motion.div>
            <h2 className="font-display font-bold text-white text-2xl mb-1">Admin Login</h2>
            <p className="text-gray-600 text-sm font-mono">Portfolio management access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 font-mono mb-2">EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-mono mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors p-0.5">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl">
                  <Lock size={13} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-2 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              {loading ? 'Verifying…' : 'Login'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
