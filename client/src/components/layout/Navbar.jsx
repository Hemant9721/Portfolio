import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cat, Mail, Shield, LogOut } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import api from '../../utils/api';
import MessagesPanel from '../admin/MessagesPanel';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const { isAdmin, logout } = useAdminStore();
  const scrollLock = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      if (scrollLock.current) return;
      const mid = window.scrollY + window.innerHeight / 2;
      const ids = navLinks.map(l => l.href.replace('#', ''));
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isAdmin) { setUnreadCount(0); return; }
    const fetchCount = async () => {
      try {
        const res = await api.get('/contact/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleNav = (href) => {
    setActive(href.replace('#', ''));
    setOpen(false);
    scrollLock.current = true;
    setTimeout(() => { scrollLock.current = false; }, 800);

    const el = document.querySelector(href);
    if (!el) return;

    // Account for: fixed navbar (64px) + admin banner (32px when active)
    const navHeight = 64;
    const bannerHeight = isAdmin ? 32 : 0;
    const offset = navHeight + bannerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  return (
    <>
      {/* Admin mode banner — slim, unobtrusive, at very top */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#7c3aed]/15 border-b border-[#7c3aed]/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8">
              <div className="flex items-center gap-2">
                <Shield size={11} className="text-[#a78bfa]" />
                <span className="text-[11px] font-mono text-[#a78bfa]">Admin mode active</span>
                <span className="text-[10px] text-gray-600 hidden sm:block">— hover section edges to edit</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMessages(true)}
                  className="relative flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-[#a78bfa] transition-colors"
                >
                  <Mail size={11} />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#7c3aed] text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-red-400/70 hover:text-red-400 transition-colors"
                >
                  <LogOut size={11} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${isAdmin ? 'top-8' : 'top-0'} ${
          scrolled
            ? 'bg-[#050508]/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.15)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNav('#home')}
            className="flex items-center gap-2 font-display font-bold text-xl"
          >
            <motion.div
              className="w-8 h-8 rounded-xl bg-[#0d0d14] border border-purple-500/30 flex items-center justify-center"
              animate={{ boxShadow: ['0 0 8px rgba(124,58,237,0.9)', '0 0 22px rgba(124,58,237,0.45)', '0 0 8px rgba(124,58,237,0.95)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cat size={20} className="text-[#a78bfa]" />
            </motion.div>
            <span className="gradient-text">HS</span>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.href}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNav(link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  active === link.href.replace('#', '') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {active === link.href.replace('#', '') && (
                  <motion.span layoutId="nav-pill"
                    className="absolute inset-0 bg-[rgba(124,58,237,0.2)] rounded-lg border border-[rgba(124,58,237,0.3)]"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} />
                )}
                <span className="relative z-10">{link.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right side — non-admin shows Hire Me */}
          <div className="hidden md:flex items-center gap-3">
            {!isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNav('#contact')}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all glow-primary"
              >
                Hire Me
              </motion.button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="flex md:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#050508]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
          >
            <button className={`absolute ${isAdmin ? 'top-13' : 'top-5'} right-7 text-gray-400`} onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNav(link.href)}
                className="font-display text-3xl font-bold text-gray-300 hover:text-white hover:text-glow transition-all"
              >
                {link.label}
              </motion.button>
            ))}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                onClick={() => { setShowMessages(true); setOpen(false); }}
                className="text-[#a78bfa] text-xl font-display flex items-center gap-2"
              >
                <Mail size={20} /> Messages {unreadCount > 0 && `(${unreadCount})`}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Panel */}
      <AnimatePresence>
        {showMessages && (
          <MessagesPanel
            onClose={() => setShowMessages(false)}
            onCountUpdate={(count) => setUnreadCount(count)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
