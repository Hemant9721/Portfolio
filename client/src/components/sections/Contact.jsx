import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, MapPin, Phone, Loader2, CheckCircle,
  Settings2, Check, X, GitBranch, Link2, Save, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import useAdminStore from '../../store/adminStore';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

const DEFAULT_INFO = {
  email: 'dcsoni2480@gmail.com',
  phone: '+91 8852 003 726',
  location: 'Sikar, Rajasthan, India',
  availabilityNote: "I'm a final-year CSE student actively looking for full-time roles and internships in Full Stack Development and Frontend Engineering.",
  githubUrl: 'https://github.com/Hemant9721',
  linkedinUrl: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/',
};

// ── Admin edit drawer ──────────────────────────────────────────────────────
function ContactEditDrawer({ info, onChange, onSave, saving }) {
  const [open, setOpen] = useState(false);

  const fields = [
    { label: 'Email', key: 'email', placeholder: 'your@email.com' },
    { label: 'Phone', key: 'phone', placeholder: '+91 00000 00000' },
    { label: 'Location', key: 'location', placeholder: 'City, State, Country' },
    { label: 'GitHub URL', key: 'githubUrl', placeholder: 'https://github.com/...' },
    { label: 'LinkedIn URL', key: 'linkedinUrl', placeholder: 'https://linkedin.com/...' },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed right-0 bottom-1/3 z-40 flex items-center gap-2 pl-3 pr-2 py-3 rounded-l-xl bg-[#13131f] border border-r-0 border-[#7c3aed]/40 text-[#a78bfa] text-xs font-mono shadow-lg shadow-[#7c3aed]/10 hover:bg-[rgba(124,58,237,0.15)] transition-all"
        title="Edit Contact info"
      >
        <Settings2 size={13} />
        <span className="hidden xl:block text-[11px]">Contact</span>
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
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(124,58,237,0.15)] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
                    <Settings2 size={13} className="text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Edit Contact</p>
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

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {fields.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[11px] text-gray-500 font-mono mb-1">{label}</label>
                    <input
                      value={info[key] || ''}
                      onChange={e => onChange({ ...info, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-[11px] text-gray-500 font-mono mb-1">Availability Note</label>
                  <textarea
                    value={info.availabilityNote || ''}
                    onChange={e => onChange({ ...info, availabilityNote: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors resize-y"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Contact section ───────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { isAdmin } = useAdminStore();

  useEffect(() => {
    api.get('/contact-info').then(res => {
      setInfo({ ...DEFAULT_INFO, ...res.data });
    }).catch(() => {});
  }, []);

  const saveInfo = async () => {
    setSaving(true);
    try {
      await api.put('/contact-info', info);
      toast.success('Contact info saved!');
    } catch {
      toast.error('Failed to save');
    } finally { setSaving(false); }
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!form.subject.trim()) {
      toast.error('Please enter a subject');
      return false;
    }
    if (!form.message.trim()) {
      toast.error('Please enter your message');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm(INITIAL_FORM);
      toast.success('Message sent successfully!');
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally { 
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: info.email, href: `mailto:${info.email}` },
    { icon: MapPin, label: 'Location', value: info.location, href: null },
    { icon: Phone, label: 'Available', value: info.phone, href: null },
  ];

  return (
    <section id="contact" className="py-28 px-6 relative overflow-visible">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="font-mono text-[#7c3aed] text-sm tracking-widest uppercase mb-3">Let's work together</p>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            I'm currently open to new opportunities. Whether you have a project or just want to say hi — my inbox is always open!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info side */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 space-y-4">

            {contactItems.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="gradient-border rounded-2xl p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#a78bfa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-gray-200 hover:text-[#a78bfa] transition-colors font-medium">{value}</a>
                  ) : (
                    <p className="text-gray-200 font-medium">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="gradient-border rounded-2xl p-6">
              <p className="text-gray-400 text-sm leading-relaxed">{info.availabilityNote}</p>
            </motion.div>

            {/* Social links */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="flex gap-3">
              <a href={info.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-border text-gray-400 hover:text-white text-sm font-medium transition-colors">
                <GitBranch size={15} /> GitHub
              </a>
              <a href={info.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-border text-gray-400 hover:text-white text-sm font-medium transition-colors">
                <Link2 size={15} /> LinkedIn
              </a>
            </motion.div>
          </motion.div>

          {/* Form side */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-3">
            <div className="gradient-border rounded-2xl p-8">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <CheckCircle size={56} className="text-green-400" />
                  <h3 className="font-display font-bold text-white text-2xl">Message Sent!</h3>
                  <p className="text-gray-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Your Name <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                        placeholder="Username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Subject <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={form.subject} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                      placeholder="Job Opportunity / Project Collaboration"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Message <span className="text-red-400">*</span></label>
                    <textarea 
                      name="message" 
                      value={form.message} 
                      onChange={handleChange} 
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors resize-none"
                      placeholder="Hi, I'd like to talk about..."
                    />
                  </div>
                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin contact edit drawer */}
      {isAdmin && (
        <ContactEditDrawer info={info} onChange={setInfo} onSave={saveInfo} saving={saving} />
      )}
    </section>
  );
}