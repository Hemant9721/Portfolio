import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = [
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Cyan',   value: '#06b6d4' },
  { label: 'Amber',  value: '#f59e0b' },
  { label: 'Green',  value: '#10b981' },
  { label: 'Pink',   value: '#ec4899' },
  { label: 'Red',    value: '#ef4444' },
];

const ICON_OPTIONS = ['GraduationCap', 'Briefcase', 'Code2', 'Zap'];

// ── Sub-modal: Edit Bio ──────────────────────────────────────────────────────
function BioModal({ bio, onClose, onSave }) {
  const [paragraphs, setParagraphs] = useState([...bio]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const clean = paragraphs.map(p => p.trim()).filter(Boolean);
    if (!clean.length) { toast.error('Add at least one paragraph'); return; }
    setLoading(true);
    try {
      await api.put('/about', { bio: clean });
      toast.success('Bio updated!');
      onSave();
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Edit Bio" onClose={onClose}>
      <div className="p-6 space-y-3">
        <label className="block text-sm font-medium text-gray-400 mb-1">Bio Paragraphs</label>
        <AnimatePresence>
          {paragraphs.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="flex gap-2"
            >
              <textarea
                value={p}
                onChange={e => setParagraphs(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
                rows={3}
                placeholder={`Paragraph ${i + 1}`}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors resize-none"
              />
              <button onClick={() => setParagraphs(prev => prev.filter((_, idx) => idx !== i))}
                className="text-gray-600 hover:text-red-400 transition-colors self-start pt-3">
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => setParagraphs(prev => [...prev, ''])}
          className="flex items-center gap-1.5 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium mt-1">
          <Plus size={14} /> Add Paragraph
        </button>
      </div>
      <ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} label="Update Bio" />
    </ModalShell>
  );
}

// ── Sub-modal: Edit Stats ────────────────────────────────────────────────────
function StatsModal({ stats, onClose, onSave }) {
  const [rows, setRows] = useState(stats.map(s => ({ ...s })));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const clean = rows.filter(r => r.value.trim() && r.label.trim());
    if (!clean.length) { toast.error('Add at least one stat'); return; }
    setLoading(true);
    try {
      await api.put('/about', { stats: clean });
      toast.success('Stats updated!');
      onSave();
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Edit Stats" onClose={onClose}>
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500 px-1">Value</span>
          <span className="text-xs font-medium text-gray-500 px-1">Label</span>
          <span />
        </div>
        <AnimatePresence>
          {rows.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
            >
              <input value={r.value} onChange={e => setRows(prev => prev.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))}
                placeholder="10+" className="px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors" />
              <input value={r.label} onChange={e => setRows(prev => prev.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
                placeholder="Projects Built" className="px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors" />
              <button onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
                className="text-gray-600 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => setRows(prev => [...prev, { value: '0+', label: 'New Stat' }])}
          className="flex items-center gap-1.5 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium mt-1">
          <Plus size={14} /> Add Stat
        </button>
      </div>
      <ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} label="Update Stats" />
    </ModalShell>
  );
}

// ── Sub-modal: Edit single Timeline entry ───────────────────────────────────
function TimelineEntryModal({ entry, entryIndex, allTimeline, onClose, onSave }) {
  const isNew = entryIndex === -1;
  const [form, setForm] = useState(entry
    ? { ...entry }
    : { icon: 'Code2', year: '2024', title: '', org: '', desc: '', color: '#7c3aed' }
  );
  const [loading, setLoading] = useState(false);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.org.trim()) { toast.error('Title and organisation are required'); return; }
    setLoading(true);
    try {
      let updated;
      if (isNew) {
        updated = [...allTimeline, form];
      } else {
        updated = allTimeline.map((t, i) => i === entryIndex ? form : t);
      }
      await api.put('/about', { timeline: updated });
      toast.success(isNew ? 'Entry added!' : 'Entry updated!');
      onSave();
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={isNew ? 'Add Timeline Entry' : 'Edit Timeline Entry'} onClose={onClose}>
      <div className="p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. B.Tech Computer Science"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors" />
        </div>

        {/* Organisation */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Organisation *</label>
          <input value={form.org} onChange={e => set('org', e.target.value)}
            placeholder="e.g. Parul University"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors" />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Year / Period</label>
          <input value={form.year} onChange={e => set('year', e.target.value)}
            placeholder="e.g. 2022–2026"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
          <textarea value={form.desc} onChange={e => set('desc', e.target.value)}
            rows={3} placeholder="What did you do here?"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors resize-none" />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
          <div className="flex gap-2">
            {ICON_OPTIONS.map(name => (
              <button key={name} onClick={() => set('icon', name)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={{
                  borderColor: form.icon === name ? form.color : 'rgba(255,255,255,0.1)',
                  background: form.icon === name ? `${form.color}20` : 'transparent',
                  color: form.icon === name ? form.color : '#6b7280'
                }}>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c.value} onClick={() => set('color', c.value)} title={c.label}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  background: c.value,
                  borderColor: form.color === c.value ? '#fff' : 'transparent',
                  transform: form.color === c.value ? 'scale(1.2)' : 'scale(1)'
                }} />
            ))}
          </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} label={isNew ? 'Add Entry' : 'Update Entry'} />
    </ModalShell>
  );
}

// ── Sub-modal: Upload Resume ────────────────────────────────────────────────
function ResumeModal({ onClose, onSave }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file'); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5 MB'); return; }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error('Please select a PDF first'); return; }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await api.put('/about', { resumeUrl: ev.target.result });
        toast.success('Resume uploaded!');
        onSave();
      } catch {
        toast.error('Upload failed');
        setLoading(false);
      }
    };
    reader.onerror = () => { toast.error('Could not read file'); setLoading(false); };
    reader.readAsDataURL(file);
  };

  return (
    <ModalShell title="Upload Resume" onClose={onClose}>
      <div className="p-6 space-y-5">
        <p className="text-gray-400 text-sm">Upload a PDF — it will be stored and served for the Download Resume button.</p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[rgba(124,58,237,0.35)] rounded-xl p-10 text-center cursor-pointer hover:border-[rgba(124,58,237,0.7)] hover:bg-[rgba(124,58,237,0.04)] transition-all"
        >
          <Upload size={28} className="mx-auto mb-3 text-[#7c3aed] opacity-70" />
          {file
            ? <p className="text-white text-sm font-medium">{file.name}</p>
            : <p className="text-gray-500 text-sm">Click to select a PDF <br /><span className="text-xs">Max 5 MB</span></p>
          }
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFile} className="sr-only" />
        </div>
      </div>
      <ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} label="Upload" />
    </ModalShell>
  );
}

// ── Shared shell & footer ────────────────────────────────────────────────────
function ModalShell({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
        className="gradient-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#0d0d14' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[rgba(124,58,237,0.2)]">
          <h2 className="font-display font-bold text-white text-xl">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalFooter({ onClose, onSubmit, loading, label }) {
  return (
    <div className="flex gap-3 p-6 border-t border-[rgba(124,58,237,0.2)]">
      <button onClick={onClose}
        className="flex-1 px-5 py-3 rounded-xl border border-[rgba(124,58,237,0.25)] text-gray-400 hover:text-white hover:border-[rgba(124,58,237,0.5)] transition-all text-sm font-medium">
        Cancel
      </button>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onSubmit} disabled={loading}
        className="flex-1 px-5 py-3 rounded-xl bg-[#7c3aed] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 glow-primary">
        {loading && <Loader2 size={15} className="animate-spin" />}
        {label}
      </motion.button>
    </div>
  );
}

// ── Main export — decides which sub-modal to show ────────────────────────────
export default function AboutModal({ mode, data, entryIndex, onClose, onSave }) {
  if (mode === 'bio')      return <BioModal bio={data.bio} onClose={onClose} onSave={onSave} />;
  if (mode === 'stats')    return <StatsModal stats={data.stats} onClose={onClose} onSave={onSave} />;
  if (mode === 'resume')   return <ResumeModal onClose={onClose} onSave={onSave} />;
  if (mode === 'timeline') return (
    <TimelineEntryModal
      entry={entryIndex === -1 ? null : data.timeline[entryIndex]}
      entryIndex={entryIndex}
      allTimeline={data.timeline}
      onClose={onClose}
      onSave={onSave}
    />
  );
  return null;
}