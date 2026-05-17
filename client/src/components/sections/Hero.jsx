import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, GitBranch, Link2, Mail, ArrowUpRight, Settings2, Check, X, Plus, Trash2 } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DEFAULT_DATA = {
  greeting: "Hello, I'm",
  firstName: 'Hemant',
  lastName: 'Soni',
  roles: ['Full Stack Developer', 'MERN Stack Engineer', 'React Developer', 'DSA Enthusiast'],
  tagline: "B.Tech CSE student at Parul University — building real-time, full-stack applications with the MERN stack, Socket.IO, Firebase, and modern web technologies.",
  availableText: 'Available for opportunities',
  githubUrl: 'https://github.com/Hemant9721',
  linkedinUrl: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/',
  email: 'dcsoni2480@gmail.com',
};

function RotatingText({ texts }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % texts.length), 2600);
    return () => clearInterval(t);
  }, [texts.length]);
  return (
    <AnimatePresence mode="wait">
      <motion.span key={index}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        className="font-display text-xl md:text-2xl font-semibold text-[#06b6d4]">
        {texts[index]}
      </motion.span>
    </AnimatePresence>
  );
}

// ── Admin edit drawer ──────────────────────────────────────────────────────
function HeroEditDrawer({ data, onChange, onSave, saving }) {
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const local = data;

  const set = (field, val) => onChange({ ...local, [field]: val });
  const addRole = () => {
    const t = newRole.trim();
    if (!t) return;
    set('roles', [...local.roles, t]);
    setNewRole('');
  };
  const removeRole = (i) => set('roles', local.roles.filter((_, idx) => idx !== i));

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 pl-3 pr-2 py-3 rounded-l-xl bg-[#13131f] border border-r-0 border-[#7c3aed]/40 text-[#a78bfa] text-xs font-mono shadow-lg shadow-[#7c3aed]/10 hover:bg-[rgba(124,58,237,0.15)] transition-all"
        title="Edit Hero section"
      >
        <Settings2 size={13} />
        <span className="hidden xl:block text-[11px]">Hero</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 bottom-0 z-50 w-full max-w-sm flex flex-col overflow-hidden" style={{ top: "2rem", background: "#080810", borderLeft: "1px solid rgba(124,58,237,0.2)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(124,58,237,0.15)] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
                    <Settings2 size={13} className="text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Edit Hero</p>
                    <p className="text-gray-600 text-[10px] font-mono">Admin</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onSave(); setOpen(false); }} disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white text-xs font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
                    <Check size={11} />{saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[
                  { label: 'Greeting', field: 'greeting', placeholder: "Hello, I'm" },
                  { label: 'First Name', field: 'firstName', placeholder: 'Hemant' },
                  { label: 'Last Name', field: 'lastName', placeholder: 'Soni' },
                  { label: 'Available Text', field: 'availableText', placeholder: 'Available for opportunities' },
                  { label: 'GitHub URL', field: 'githubUrl', placeholder: 'https://github.com/...' },
                  { label: 'LinkedIn URL', field: 'linkedinUrl', placeholder: 'https://linkedin.com/...' },
                  { label: 'Email', field: 'email', placeholder: 'your@email.com' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-[11px] text-gray-500 font-mono mb-1">{label}</label>
                    <input
                      value={local[field]}
                      onChange={e => set(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors"
                    />
                  </div>
                ))}

                {/* Tagline */}
                <div>
                  <label className="block text-[11px] text-gray-500 font-mono mb-1">Tagline</label>
                  <textarea value={local.tagline} onChange={e => set('tagline', e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors resize-y" />
                </div>

                {/* Roles */}
                <div>
                  <label className="block text-[11px] text-gray-500 font-mono mb-2">Roles (rotating)</label>
                  <div className="space-y-1.5 mb-2">
                    {local.roles.map((role, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input value={role} onChange={e => { const r = [...local.roles]; r[i] = e.target.value; set('roles', r); }}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                        <button onClick={() => removeRole(i)} className="text-gray-600 hover:text-red-400 transition-colors p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newRole} onChange={e => setNewRole(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addRole()}
                      placeholder="New role…"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                    <button onClick={addRole} className="px-2.5 py-1.5 rounded-lg bg-[#7c3aed]/30 text-[#a78bfa] text-xs hover:bg-[#7c3aed]/50 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Hero() {
  const { isAdmin } = useAdminStore();
  const [data, setData] = useState(DEFAULT_DATA);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/hero').then(res => {
      const d = res.data;
      setData({
        greeting: d.greeting || DEFAULT_DATA.greeting,
        firstName: d.firstName || DEFAULT_DATA.firstName,
        lastName: d.lastName || DEFAULT_DATA.lastName,
        roles: d.roles?.length ? d.roles : DEFAULT_DATA.roles,
        tagline: d.tagline || DEFAULT_DATA.tagline,
        availableText: d.availableText || DEFAULT_DATA.availableText,
        githubUrl: d.githubUrl || DEFAULT_DATA.githubUrl,
        linkedinUrl: d.linkedinUrl || DEFAULT_DATA.linkedinUrl,
        email: d.email || DEFAULT_DATA.email,
      });
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/hero', data);
      toast.success('Hero section saved!');
    } catch {
      toast.error('Failed to save');
    } finally { setSaving(false); }
  };

  const socials = [
    { icon: GitBranch, href: data.githubUrl, label: 'GitHub' },
    { icon: Link2, href: data.linkedinUrl, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${data.email}`, label: 'Email' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Available badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.08)] text-sm font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {data.availableText}
        </motion.div>

        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <p className="font-mono text-[#7c3aed] text-lg mb-3 tracking-widest uppercase">{data.greeting}</p>
          <h1 className="font-display text-4xl xsm:text-5xl sm:text-6xl md:text-8xl font-black leading-none mb-4">
            <span className="text-white">{data.firstName}</span><br />
            <span className="gradient-text text-glow">{data.lastName}</span>
          </h1>
        </motion.div>

        {/* Rotating roles */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 h-10 flex items-center justify-center">
          <RotatingText texts={data.roles.length ? data.roles : ['Developer']} />
        </motion.div>

        {/* Tagline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          <p>{data.tagline}</p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }} whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold text-base transition-all">
            View My Work
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl border border-[rgba(124,58,237,0.4)] text-gray-300 hover:text-white hover:border-[rgba(124,58,237,0.7)] font-semibold text-base transition-all flex items-center gap-2">
            <ArrowUpRight size={16} /> Hire Me
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a key={label} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
              href={href} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl gradient-border flex items-center justify-center text-gray-400 hover:text-[#a78bfa] transition-colors" title={label}>
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown size={20} />
        </motion.div>
      </motion.button>

      {/* Admin drawer */}
      {isAdmin && (
        <HeroEditDrawer data={data} onChange={setData} onSave={save} saving={saving} />
      )}
    </section>
  );
}
