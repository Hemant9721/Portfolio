import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  GraduationCap, Briefcase, Code2, Zap,
  Plus, Trash2, Download, Upload, Settings2, Check, X, Loader2
} from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ICON_MAP     = { GraduationCap, Briefcase, Code2, Zap };
const ICON_OPTIONS = ['GraduationCap', 'Briefcase', 'Code2', 'Zap'];
const COLOR_OPTIONS = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

const DEFAULT_DATA = {
  bio: [
    "I'm Hemant Soni, a passionate Full Stack Developer and final-year B.Tech CSE student at Parul University (Class of 2026).",
    "My journey into tech started with curiosity and evolved into a deep love for building real-time, scalable web applications. I specialize in the MERN stack, and I've worked with Socket.IO, Firebase, Cloudinary, Tailwind CSS, and Zustand across multiple production-grade projects.",
    "I believe in clean code, thoughtful architecture, and user-first design. When I'm not building, I'm exploring new technologies and contributing to open source."
  ],
  stats: [
    { value: '10+', label: 'Projects Built' },
    { value: '2+',  label: 'Years Coding'   },
    { value: '3+',  label: 'Partners'       },
    { value: '100%',label: 'Dedication'     },
  ],
  timeline: [
    { icon: 'GraduationCap', year: '2022–2026',    title: 'B.Tech Computer Science & Engineering', org: 'Parul University, Vadodara',       desc: 'Graduating 2026. Core focus on full-stack development, data structures, and system design.',                                             color: '#7c3aed' },
    { icon: 'Briefcase',     year: '2024',          title: 'Web Development Intern',                org: 'TechnoHacks Solutions Pvt. Ltd.',  desc: 'Built a real-time chat application using MERN stack and Socket.IO. Contributed to production codebase.',                               color: '#06b6d4' },
    { icon: 'Code2',         year: '2023–Present',  title: 'Open Source & Personal Projects',       org: 'Independent',                      desc: 'Developed multiple full-stack applications — WhatsApp-style chat apps, secure exam platform, AI-powered tools.',                         color: '#f59e0b' },
  ],
  hasResume: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin Edit Drawer
// ─────────────────────────────────────────────────────────────────────────────
function AdminEditDrawer({
  data, onUpdate, onSave, saving,
  uploadRef, onFileChange, uploading,
  hasResume, resumeFilename, onDeleteResume
}) {
  const [open, setOpen]   = useState(false);
  const [tab,  setTab]    = useState('bio');
  const TABS = ['bio', 'stats', 'timeline', 'resume'];

  const updateBio  = (i, val) => onUpdate(d => ({ ...d, bio:      d.bio.map((p, idx)       => idx === i ? val : p) }));
  const addBio     = ()       => onUpdate(d => ({ ...d, bio:      [...d.bio, 'New paragraph text here.'] }));
  const removeBio  = (i)      => onUpdate(d => ({ ...d, bio:      d.bio.filter((_, idx)    => idx !== i) }));

  const updateStat = (i, f, v) => onUpdate(d => ({ ...d, stats:    d.stats.map((s, idx)    => idx === i ? { ...s, [f]: v } : s) }));
  const addStat    = ()         => onUpdate(d => ({ ...d, stats:    [...d.stats, { value: '0+', label: 'New Stat' }] }));
  const removeStat = (i)        => onUpdate(d => ({ ...d, stats:    d.stats.filter((_, idx) => idx !== i) }));

  const updateTL   = (i, f, v) => onUpdate(d => ({ ...d, timeline: d.timeline.map((t, idx) => idx === i ? { ...t, [f]: v } : t) }));
  const addTL      = ()         => onUpdate(d => ({
    ...d, timeline: [...d.timeline, { icon: 'Code2', year: '2024', title: 'New Role', org: 'Organization', desc: 'Your contribution.', color: '#7c3aed' }]
  }));
  const removeTL   = (i)        => onUpdate(d => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }));

  return (
    <>
      {/* Floating edge trigger */}
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/3 z-40 flex items-center gap-2 pl-3 pr-2 py-3 rounded-l-xl bg-[#13131f] border border-r-0 border-[#7c3aed]/40 text-[#a78bfa] text-xs font-mono shadow-lg shadow-[#7c3aed]/10 hover:bg-[rgba(124,58,237,0.15)] transition-all"
        title="Edit About section"
      >
        <Settings2 size={13} />
        <span className="hidden xl:block text-[11px]">About</span>
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
              className="fixed right-0 bottom-0 z-50 w-full max-w-sm flex flex-col overflow-hidden"
              style={{ top: '2rem', background: '#080810', borderLeft: '1px solid rgba(124,58,237,0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(124,58,237,0.15)] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
                    <Settings2 size={13} className="text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-none">Edit About</p>
                    <p className="text-gray-600 text-[10px] font-mono mt-0.5">Admin</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onSave(); }} disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white text-xs font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
                    <Check size={11} />{saving ? 'Saving…' : 'Save All'}
                  </button>
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-[rgba(124,58,237,0.1)] flex-shrink-0">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-[11px] font-mono font-medium capitalize transition-colors relative ${tab === t ? 'text-[#a78bfa]' : 'text-gray-600 hover:text-gray-400'}`}>
                    {t}
                    {tab === t && <motion.div layoutId="about-drawer-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed]" />}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">

                {/* ── BIO ── */}
                {tab === 'bio' && (
                  <>
                    <p className="text-gray-600 text-[11px] font-mono mb-3">Edit bio paragraphs</p>
                    {data.bio.map((para, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <textarea value={para} onChange={e => updateBio(i, e.target.value)} rows={3}
                          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.15)] text-gray-200 text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors resize-y" />
                        <button onClick={() => removeBio(i)} className="text-gray-600 hover:text-red-400 transition-colors p-1 mt-1 flex-shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addBio} className="flex items-center gap-1.5 text-[11px] text-[#7c3aed] hover:text-[#a78bfa] font-mono transition-colors">
                      <Plus size={11} /> Add paragraph
                    </button>
                  </>
                )}

                {/* ── STATS ── */}
                {tab === 'stats' && (
                  <>
                    <p className="text-gray-600 text-[11px] font-mono mb-3">Edit stat cards</p>
                    <div className="grid grid-cols-[1fr_1.2fr_auto] gap-1.5 mb-1.5">
                      <span className="text-[10px] text-gray-600 font-mono px-1">Value</span>
                      <span className="text-[10px] text-gray-600 font-mono px-1">Label</span>
                      <span />
                    </div>
                    {data.stats.map((stat, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1.2fr_auto] gap-1.5 items-center">
                        <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)}
                          placeholder="10+" className="px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                        <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)}
                          placeholder="Label" className="px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                        <button onClick={() => removeStat(i)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addStat} className="flex items-center gap-1.5 text-[11px] text-[#7c3aed] hover:text-[#a78bfa] font-mono mt-1 transition-colors">
                      <Plus size={11} /> Add stat
                    </button>
                  </>
                )}

                {/* ── TIMELINE ── */}
                {tab === 'timeline' && (
                  <>
                    <p className="text-gray-600 text-[11px] font-mono mb-3">Edit timeline entries</p>
                    {data.timeline.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-[rgba(124,58,237,0.12)] space-y-2 relative group">
                        <button onClick={() => removeTL(i)}
                          className="absolute top-2 right-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                        <input value={item.title} onChange={e => updateTL(i, 'title', e.target.value)}
                          placeholder="Title" className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input value={item.org}  onChange={e => updateTL(i, 'org',  e.target.value)}
                            placeholder="Org"  className="px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                          <input value={item.year} onChange={e => updateTL(i, 'year', e.target.value)}
                            placeholder="Year" className="px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-white text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
                        </div>
                        <textarea value={item.desc} onChange={e => updateTL(i, 'desc', e.target.value)}
                          rows={2} placeholder="Description"
                          className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.15)] text-gray-200 text-xs outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors resize-none" />
                        {/* Icon + Color pickers */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-gray-600 font-mono">Icon:</span>
                          {ICON_OPTIONS.map(iconName => {
                            const Ic = ICON_MAP[iconName];
                            return (
                              <button key={iconName} onClick={() => updateTL(i, 'icon', iconName)}
                                className="p-1 rounded-md border transition-all"
                                style={{ borderColor: item.icon === iconName ? item.color : 'rgba(255,255,255,0.08)', background: item.icon === iconName ? `${item.color}25` : 'transparent', color: item.icon === iconName ? item.color : '#6b7280' }}>
                                <Ic size={11} />
                              </button>
                            );
                          })}
                          <span className="text-[10px] text-gray-600 font-mono ml-1">Color:</span>
                          {COLOR_OPTIONS.map(c => (
                            <button key={c} onClick={() => updateTL(i, 'color', c)}
                              className="w-3.5 h-3.5 rounded-full border-2 transition-all hover:scale-125"
                              style={{ background: c, borderColor: item.color === c ? '#fff' : 'transparent' }} />
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={addTL}
                      className="w-full py-2.5 rounded-xl border border-dashed border-[rgba(124,58,237,0.25)] text-gray-600 hover:text-[#7c3aed] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors">
                      <Plus size={11} /> Add entry
                    </button>
                  </>
                )}

                {/* ── RESUME ── */}
                {tab === 'resume' && (
                  <div className="space-y-4">
                    {/* Hidden file input — always present but only triggered when no resume exists */}
                    <input
                      ref={uploadRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={onFileChange}
                      className="hidden"
                      aria-label="Upload resume PDF"
                    />

                    {uploading ? (
                      /* ── Uploading state ── */
                      <div className="border-2 border-dashed border-[rgba(124,58,237,0.3)] rounded-2xl p-8 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#a78bfa] text-xs font-mono">Uploading resume…</p>
                      </div>
                    ) : hasResume ? (
                      /* ── Resume uploaded: show file info, lock the upload zone ── */
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Download size={16} className="text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-emerald-400 text-xs font-semibold font-mono mb-0.5">Resume uploaded ✓</p>
                            <p className="text-gray-300 text-xs truncate font-medium">{resumeFilename || 'resume.pdf'}</p>
                            <p className="text-gray-600 text-[10px] mt-1 font-mono">Visitors can download this file</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Replace — triggers file picker, handleFileChange will confirm */}
                          <button
                            type="button"
                            onClick={() => { if (uploadRef.current) { uploadRef.current.value = ''; uploadRef.current.click(); } }}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[rgba(124,58,237,0.3)] text-[#a78bfa] text-xs font-mono hover:bg-[rgba(124,58,237,0.1)] transition-colors"
                          >
                            <Upload size={12} /> Replace
                          </button>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={onDeleteResume}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>

                        <p className="text-gray-700 text-[10px] font-mono leading-relaxed px-1">
                          To upload a new version, click <strong className="text-gray-500">Replace</strong>. The old file will be overwritten after confirmation.
                        </p>
                      </div>
                    ) : (
                      /* ── No resume yet: show upload zone ── */
                      <div className="space-y-3">
                        <p className="text-gray-600 text-[11px] font-mono">
                          No resume uploaded yet. Select a PDF to make it downloadable for visitors.
                        </p>
                        <button
                          type="button"
                          onClick={() => { if (uploadRef.current) { uploadRef.current.value = ''; uploadRef.current.click(); } }}
                          className="w-full border-2 border-dashed border-[rgba(124,58,237,0.3)] rounded-2xl p-7 text-center cursor-pointer hover:border-[rgba(124,58,237,0.6)] hover:bg-[rgba(124,58,237,0.04)] transition-all group"
                        >
                          <Upload size={24} className="mx-auto mb-2.5 text-[#7c3aed] opacity-60 group-hover:opacity-100 transition-opacity" />
                          <p className="text-gray-400 text-xs">Click to select PDF</p>
                          <p className="text-gray-600 text-[10px] mt-0.5">Max 8 MB · PDF only</p>
                        </button>
                        <p className="text-gray-700 text-[10px] font-mono leading-relaxed">
                          The file uploads immediately — no need to click "Save All".
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main About section
// ─────────────────────────────────────────────────────────────────────────────
export default function About() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { isAdmin } = useAdminStore();
  const uploadInputRef = useRef(null);

  const [data,           setData]           = useState(DEFAULT_DATA);
  const [saving,         setSaving]         = useState(false);
  const [uploading,      setUploading]      = useState(false);
  const [downloading,    setDownloading]    = useState(false);
  const [hasResume,      setHasResume]      = useState(false);
  const [resumeFilename, setResumeFilename] = useState('');  // filename stored on server

  // ── Fetch about data on mount ──────────────────────────────────────────
  useEffect(() => {
    api.get('/about')
      .then(res => {
        const d = res.data;
        setData({
          bio:      d.bio?.length      ? d.bio      : DEFAULT_DATA.bio,
          stats:    d.stats?.length    ? d.stats    : DEFAULT_DATA.stats,
          timeline: d.timeline?.length ? d.timeline : DEFAULT_DATA.timeline,
        });
        setHasResume(!!d.hasResume);
        if (d.resumeFilename) setResumeFilename(d.resumeFilename);
      })
      .catch(() => {});
  }, []);

  const update = useCallback((fn) => setData(prev => ({ ...fn(prev) })), []);

  // ── Resume file selected → immediately upload to server ───────────────
  // If a resume already exists, it will be replaced after user confirms.
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) { toast.error('Please select a PDF file'); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error('File must be under 8 MB'); return; }

    // If a resume already exists, confirm replacement
    if (hasResume) {
      const ok = window.confirm(
        `A resume is already uploaded (${resumeFilename || 'resume.pdf'}).\nReplace it with "${file.name}"?`
      );
      if (!ok) return;
    }

    setUploading(true);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = ev => resolve(ev.target.result);
        reader.onerror = ()  => reject(new Error('Read failed'));
        reader.readAsDataURL(file);
      });

      await api.post('/about/resume/upload', {
        base64,
        filename: file.name,
      });

      setHasResume(true);
      setResumeFilename(file.name);
      toast.success('Resume uploaded! Visitors can now download it.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected if needed
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  // ── Delete resume from server ──────────────────────────────────────────
  const handleDeleteResume = async () => {
    if (!window.confirm('Remove the uploaded resume? Visitors will no longer be able to download it.')) return;
    try {
      await api.delete('/about/resume');
      setHasResume(false);
      setResumeFilename('');
      toast.success('Resume removed');
    } catch {
      toast.error('Failed to remove resume');
    }
  };

  // ── Save bio / stats / timeline ────────────────────────────────────────
  const saveAll = async () => {
    setSaving(true);
    try {
      await api.put('/about', {
        bio:      data.bio,
        stats:    data.stats,
        timeline: data.timeline,
      });
      toast.success('About section saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Download resume via axios blob fetch ──────────────────────────────
  // Using axios (not a plain anchor) so:
  //   1. It goes through the Vite dev proxy correctly
  //   2. JWT token is attached automatically (interceptor)
  //   3. We get a Blob back and trigger a native download — no CSP issues
  const downloadResume = async () => {
    if (!hasResume) {
      toast.error('No resume uploaded yet');
      return;
    }
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await api.get('/about/resume/download', {
        responseType: 'blob',      // ← key: get raw bytes, not JSON
      });

      // Determine filename from Content-Disposition header or fall back
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename[^;=\n]*=["']?([^"'\n;]+)/i);
      const fname = match ? match[1].trim() : (resumeFilename || 'Hemant_Soni_Resume.pdf');

      // Create an object URL from the blob and trigger download
      const blob    = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const link    = document.createElement('a');
      link.href     = blobUrl;
      link.download = fname;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 300);

      toast.success('Download started!');
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) toast.error('Resume not found on server. Please re-upload.');
      else toast.error('Download failed. Please try again.');
      console.error('Resume download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-x-hidden">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header — scales like Hero / Projects on small screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20 px-1"
        >
          <p className="font-mono text-[#7c3aed] text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">Get to know me</p>
          <h2 className="font-display text-4xl xsm:text-5xl md:text-6xl font-black text-white leading-tight">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Bio + Resume + Stats ── */}
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-5 text-gray-400 text-base md:text-lg leading-relaxed mb-6 sm:mb-8"
            >
              {data.bio.map((para, i) => <p key={i}>{para}</p>)}
            </motion.div>

            {/* Resume download */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col xsm:flex-row flex-wrap xsm:items-center gap-3 mb-8 sm:mb-10"
            >
              <motion.button
                type="button"
                onClick={downloadResume}
                disabled={downloading}
                whileHover={downloading ? {} : { scale: 1.04, boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
                whileTap={downloading ? {} : { scale: 0.97 }}
                className="inline-flex w-full xsm:w-auto min-h-[44px] justify-center items-center gap-2 px-5 py-2.5 z-1 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold text-sm transition-opacity shadow-lg shadow-[#7c3aed]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {downloading
                  ? <><Loader2 size={16} className="animate-spin shrink-0" /> Downloading…</>
                  : <><Download size={16} className="shrink-0" /> Download Resume</>
                }
              </motion.button>
              {hasResume && !downloading && (
                <span className="text-xs text-emerald-400 font-mono text-center xsm:text-left">✓ Resume available</span>
              )}
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {data.stats.map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="gradient-border rounded-xl p-4 sm:p-5 text-center min-w-0"
                >
                  <div className="font-display text-2xl sm:text-3xl font-black gradient-text mb-1 break-words">{stat.value}</div>
                  <div className="text-gray-500 text-xs sm:text-sm leading-snug">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Timeline ── */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {data.timeline.map((item, i) => {
              const IconComp = ICON_MAP[item.icon] || Code2;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className="gradient-border rounded-2xl p-4 sm:p-6 hover:bg-[rgba(124,58,237,0.03)] transition-colors"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                        <IconComp size={20} style={{ color: item.color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3 mb-1">
                        <h3 className="font-display font-bold text-white text-sm sm:text-base leading-snug pr-0 sm:pr-2">{item.title}</h3>
                        <span className="font-mono text-[11px] sm:text-xs text-gray-500 shrink-0">{item.year}</span>
                      </div>
                      <p className="text-[#7c3aed] text-xs sm:text-sm font-medium mb-2 break-words">{item.org}</p>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin drawer — only rendered when admin, never touches visitor layout */}
      {isAdmin && (
        <AdminEditDrawer
          data={data}
          onUpdate={update}
          onSave={saveAll}
          saving={saving}
          uploadRef={uploadInputRef}
          onFileChange={handleFileChange}
          uploading={uploading}
          hasResume={hasResume}
          resumeFilename={resumeFilename}
          onDeleteResume={handleDeleteResume}
        />
      )}
    </section>
  );
}
