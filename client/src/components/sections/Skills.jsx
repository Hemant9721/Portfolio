import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Database, Settings2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import useAdminStore from '../../store/adminStore';
import SkillModal from '../admin/SkillModal';
import toast from 'react-hot-toast';

const FALLBACK_GROUPS = [
  {
    _id: 'f1', category: 'Frontend', color: '#7c3aed',
    skills: [
      { name: 'React.js', level: 92 }, { name: 'JavaScript (ES6+)', level: 88 },
      { name: 'Tailwind CSS', level: 90 }, { name: 'HTML5 / CSS3', level: 95 },
      { name: 'Framer Motion', level: 75 },
    ]
  },
  {
    _id: 'f2', category: 'Backend', color: '#06b6d4',
    skills: [
      { name: 'Node.js', level: 85 }, { name: 'Express.js', level: 83 },
      { name: 'Socket.IO', level: 80 }, { name: 'REST APIs', level: 88 },
      { name: 'JWT / Auth', level: 82 },
    ]
  },
  {
    _id: 'f3', category: 'Database & Cloud', color: '#f59e0b',
    skills: [
      { name: 'MongoDB', level: 82 }, { name: 'Firebase', level: 78 },
      { name: 'Cloudinary', level: 75 }, { name: 'Mongoose ODM', level: 83 },
      { name: 'Vercel / Railway', level: 70 },
    ]
  },
  {
    _id: 'f4', category: 'Tools & Other', color: '#ec4899',
    skills: [
      { name: 'Git & GitHub', level: 88 }, { name: 'Zustand', level: 80 },
      { name: 'Postman', level: 85 }, { name: 'VS Code', level: 95 },
      { name: 'Nodemailer', level: 75 },
    ]
  }
];

const FALLBACK_BADGES = [
  'React', 'Node.js', 'MongoDB', 'Express', 'Socket.IO', 'Firebase',
  'Tailwind', 'Zustand', 'Git', 'Cloudinary', 'JWT', 'REST API',
  'Framer Motion', 'Postman', 'Vite'
];

function SkillBar({ name, level, color, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-gray-300 text-sm font-medium">{name}</span>
        <span className="font-mono text-xs" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

function SkillGroupCard({ group, index, isAdmin, onEdit, onDelete, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="gradient-border rounded-2xl p-7 relative group"
    >
      {/* Admin controls — appear on hover, compact corner placement */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(group)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-[rgba(124,58,237,0.2)] text-purple-300 hover:bg-[rgba(124,58,237,0.35)] transition-colors">
            <Pencil size={10} /> Edit
          </button>
          <button onClick={() => onDelete(group._id)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <Trash2 size={10} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 rounded-full" style={{ background: group.color }} />
        <h3 className="font-display font-bold text-white text-xl">{group.category}</h3>
      </div>
      {group.skills.map((skill, si) => (
        <SkillBar key={skill.name} {...skill} color={group.color} delay={index * 0.1 + si * 0.05} />
      ))}
    </motion.div>
  );
}

// ── Admin Badges Panel ──────────────────────────────────────────────────────
function BadgesAdminPanel({ badges, onAdd, onRemove, isInView }) {
  const [newBadge, setNewBadge] = useState('');

  const add = () => {
    const t = newBadge.trim();
    if (!t || badges.includes(t)) return;
    onAdd(t);
    setNewBadge('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="mt-4 p-4 rounded-2xl border border-dashed border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.03)]"
    >
      <p className="text-[11px] text-gray-600 font-mono mb-3">Manage tech badges</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={newBadge}
          onChange={e => setNewBadge(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add technology…"
          className="flex-1 px-3 py-2 rounded-xl text-xs font-mono border border-[rgba(124,58,237,0.2)] bg-white/5 text-white placeholder-gray-600 outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors"
        />
        <button onClick={add}
          className="px-4 py-2 rounded-xl text-xs font-mono bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors">
          Add
        </button>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [badges, setBadges] = useState([]);

  const { isAdmin } = useAdminStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const fetchGroups = async () => {
    try {
      const res = await api.get('/skills');
      if (res.data.length === 0) { setGroups(FALLBACK_GROUPS); setIsFallback(true); }
      else { setGroups(res.data); setIsFallback(false); }
    } catch {
      setGroups(FALLBACK_GROUPS); setIsFallback(true);
    } finally { setLoading(false); }
  };

  const fetchBadges = async () => {
    try {
      const res = await api.get('/skills/badges');
      setBadges(res.data);
    } catch { setBadges(FALLBACK_BADGES); }
  };

  useEffect(() => { fetchGroups(); fetchBadges(); }, []);

  const handleSave = () => { setShowModal(false); setEditGroup(null); fetchGroups(); };

  const handleEdit = (group) => {
    if (group._id?.startsWith('f')) { toast('Seed the database first, then edit your skills.', { icon: '💡' }); return; }
    setEditGroup(group); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (id?.startsWith('f')) { toast('Seed the database first to manage skills.', { icon: '💡' }); return; }
    if (!confirm('Delete this skill group?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill group deleted');
      fetchGroups();
    } catch { toast.error('Delete failed'); }
  };

  const handleSeed = async () => {
    try {
      const res = await api.post('/skills/seed');
      toast.success(res.data.message || 'Skills seeded!');
      fetchGroups();
    } catch (err) { toast.error(err.response?.data?.message || 'Seed failed'); }
  };

  const saveBadges = async (updated) => {
    try { await api.put('/skills/badges', { badges: updated }); }
    catch { toast.error('Failed to save badges'); }
  };

  const addBadge = (tech) => { const updated = [...badges, tech]; setBadges(updated); saveBadges(updated); };
  const removeBadge = (tech) => { const updated = badges.filter(b => b !== tech); setBadges(updated); saveBadges(updated); };

  return (
    <section id="skills" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-[#7c3aed] text-sm tracking-widest uppercase mb-3">What I work with</p>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white">
            Tech <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        {/* Admin actions row — clean, doesn't distort layout */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl border border-dashed border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.03)]"
          >
            <span className="text-[11px] text-gray-600 font-mono mr-1">Admin:</span>
            <button onClick={() => { setEditGroup(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7c3aed] text-white font-medium text-xs hover:bg-[#6d28d9] transition-colors">
              <Plus size={12} /> Add Skill Group
            </button>
            {isFallback && (
              <>
                <button onClick={handleSeed}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[rgba(124,58,237,0.3)] text-purple-300 hover:bg-[rgba(124,58,237,0.1)] text-xs font-medium transition-colors">
                  <Database size={12} /> Seed Default Skills
                </button>
                <span className="text-[11px] text-gray-600 font-mono">Showing fallback — seed to persist</span>
              </>
            )}
          </motion.div>
        )}

        {/* Skill groups grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="gradient-border rounded-2xl h-60 animate-pulse bg-[rgba(124,58,237,0.05)]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {groups.map((group, gi) => (
              <SkillGroupCard key={group._id} group={group} index={gi} isAdmin={isAdmin} isInView={isInView}
                onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm font-mono mb-6 tracking-wider">TECHNOLOGIES I USE DAILY</p>
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((tech, i) => (
              <motion.span key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.04 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="relative group/badge px-4 py-2 rounded-full text-sm font-mono border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] text-gray-300"
              >
                {tech}
                {isAdmin && (
                  <button onClick={() => removeBadge(tech)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity">
                    ×
                  </button>
                )}
              </motion.span>
            ))}
          </div>

          {/* Admin badge adder — clean, below the badges */}
          {isAdmin && (
            <BadgesAdminPanel badges={badges} onAdd={addBadge} onRemove={removeBadge} isInView={isInView} />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <SkillModal
            group={editGroup}
            onClose={() => { setShowModal(false); setEditGroup(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
