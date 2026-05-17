import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = [
  { label: 'Purple',  value: '#7c3aed' },
  { label: 'Cyan',    value: '#06b6d4' },
  { label: 'Amber',   value: '#f59e0b' },
  { label: 'Pink',    value: '#ec4899' },
  { label: 'Green',   value: '#10b981' },
  { label: 'Red',     value: '#ef4444' },
  { label: 'Indigo',  value: '#6366f1' },
  { label: 'Orange',  value: '#f97316' },
];

const INITIAL_SKILL = { name: '', level: 80 };

function SkillRow({ skill, index, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={skill.name}
        onChange={e => onChange(index, 'name', e.target.value)}
        placeholder="Skill name"
        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
      />
      <div className="flex items-center gap-2 w-28">
        <input
          type="number"
          min={0} max={100}
          value={skill.level}
          onChange={e => onChange(index, 'level', Number(e.target.value))}
          className="w-16 px-2 py-2 rounded-lg bg-white/5 border border-[rgba(124,58,237,0.2)] text-white text-sm text-center outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
        />
        <span className="text-gray-500 text-xs font-mono">%</span>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="text-gray-600 hover:text-red-400 transition-colors p-1"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function SkillModal({ group, onClose, onSave }) {
  const isEdit = !!group;

  const [category, setCategory] = useState(group?.category || '');
  const [color, setColor]       = useState(group?.color || '#7c3aed');
  const [order, setOrder]       = useState(group?.order ?? 0);
  const [skills, setSkills]     = useState(
    group?.skills?.length
      ? group.skills.map(s => ({ name: s.name, level: s.level }))
      : [{ ...INITIAL_SKILL }]
  );
  const [loading, setLoading] = useState(false);

  const handleSkillChange = (idx, field, value) => {
    setSkills(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSkill = () => setSkills(prev => [...prev, { ...INITIAL_SKILL }]);

  const removeSkill = (idx) => setSkills(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!category.trim()) { toast.error('Category name is required'); return; }
    const validSkills = skills.filter(s => s.name.trim());
    if (!validSkills.length) { toast.error('Add at least one skill'); return; }

    setLoading(true);
    try {
      const payload = { category: category.trim(), color, order: Number(order), skills: validSkills };
      if (isEdit) {
        await api.put(`/skills/${group._id}`, payload);
        toast.success('Skill group updated!');
      } else {
        await api.post('/skills', payload);
        toast.success('Skill group added!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(124,58,237,0.2)]">
          <h2 className="font-display font-bold text-white text-xl">
            {isEdit ? 'Edit Skill Group' : 'Add Skill Group'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Category name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Category Name *</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Frontend, Backend, DevOps…"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    background: c.value,
                    borderColor: color === c.value ? '#fff' : 'transparent',
                    transform: color === c.value ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Display order */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
            />
          </div>

          {/* Skills list */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Skills <span className="text-gray-600 font-normal">(name + proficiency %)</span>
            </label>
            <div className="space-y-2.5">
              <AnimatePresence>
                {skills.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SkillRow
                      skill={s}
                      index={i}
                      onChange={handleSkillChange}
                      onRemove={removeSkill}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              onClick={addSkill}
              className="mt-3 flex items-center gap-1.5 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium"
            >
              <Plus size={14} /> Add Skill
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[rgba(124,58,237,0.2)]">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border border-[rgba(124,58,237,0.25)] text-gray-400 hover:text-white hover:border-[rgba(124,58,237,0.5)] transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-xl bg-[#7c3aed] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 glow-primary"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? 'Update Group' : 'Add Group'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
