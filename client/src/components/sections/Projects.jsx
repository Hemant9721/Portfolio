import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, Plus, Star, Filter, Pencil, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import useAdminStore from '../../store/adminStore';
import ProjectModal from '../admin/ProjectModal';

const categories = ['all', 'fullstack', 'frontend', 'backend', 'other'];

const DEMO_PROJECTS = [
  {
    id: '1', title: 'WhatsApp-Style Chat App', category: 'fullstack', featured: true,
    description: 'Real-time full-stack chat application with Socket.IO, group chats, emoji reactions, read receipts, and voice messages.',
    techStack: ['React', 'Node.js', 'Socket.IO', 'MongoDB', 'Zustand', 'Firebase'],
    githubUrl: 'https://github.com/Hemant9721/chat-app', liveUrl: '', imageUrl: ''
  },
  {
    id: '2', title: 'Secure Exam Platform', category: 'fullstack', featured: false,
    description: 'An online examination system with anti-cheating measures, real-time proctoring, and automated result generation.',
    techStack: ['React', 'Node.js', 'MongoDB', 'JWT', 'Express'],
    githubUrl: 'https://github.com/Hemant9721/exam-platform', liveUrl: '', imageUrl: ''
  },
  {
    id: '3', title: 'Artify - AI Image Generator', category: 'frontend', featured: true,
    description: 'AI-powered image generation app with beautiful UI, prompt history, and gallery features.',
    techStack: ['React', 'Tailwind CSS', 'OpenAI API', 'Framer Motion'],
    githubUrl: 'https://github.com/Hemant9721/artify', liveUrl: '', imageUrl: ''
  },
  {
    id: '4', title: 'Intrusion Detection System', category: 'backend', featured: false,
    description: 'Network intrusion detection using machine learning algorithms to classify and flag suspicious traffic patterns.',
    techStack: ['Python', 'scikit-learn', 'pandas', 'Flask'],
    githubUrl: 'https://github.com/Hemant9721/ids', liveUrl: '', imageUrl: ''
  },
  {
    id: '5', title: 'Professional Portfolio', category: 'fullstack', featured: true,
    description: 'This portfolio website — dynamic, admin-managed projects, contact form with email notifications, dark theme.',
    techStack: ['React', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/Hemant9721/portfolio', liveUrl: '', imageUrl: ''
  },
];

const categoryColors = {
  fullstack: '#7c3aed', frontend: '#06b6d4',
  backend: '#f59e0b', mobile: '#ec4899', other: '#6b7280'
};

function ProjectCard({ project, index, isAdmin, onEdit, onDelete }) {
  const color = categoryColors[project.category] || '#7c3aed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="gradient-border rounded-2xl overflow-hidden group flex flex-col relative"
    >
      {/* Admin action buttons — top right, revealed on hover */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[rgba(0,0,0,0.7)] border border-[rgba(124,58,237,0.4)] text-purple-300 hover:bg-[rgba(124,58,237,0.3)] transition-colors backdrop-blur-sm">
            <Pencil size={9} /> Edit
          </button>
          <button onClick={onDelete}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[rgba(0,0,0,0.7)] border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors backdrop-blur-sm">
            <Trash2 size={9} />
          </button>
        </div>
      )}

      {/* Card header */}
      <div
        className="h-28 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${color}18 0%, transparent 70%)` }}
      >
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="font-display text-7xl font-black opacity-[0.12] group-hover:opacity-[0.18] transition-opacity" style={{ color }}>
            {project.title.charAt(0)}
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-mono capitalize"
          style={{ background: `${color}22`, border: `1px solid ${color}40`, color }}>
          {project.category}
        </div>
        {project.featured && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/25">
            <Star size={9} fill="currentColor" /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-[#a78bfa] transition-colors leading-tight">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(project.techStack || []).slice(0, 5).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-400 border border-white/10">
              {tech}
            </span>
          ))}
          {(project.techStack || []).length > 5 && (
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-600 border border-white/10">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              <GitBranch size={14} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#06b6d4] hover:text-white transition-colors ml-auto">
              Live Demo <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const { isAdmin } = useAdminStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      setProjects(DEMO_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (activeCategory === 'all') setFiltered(projects);
    else setFiltered(projects.filter(p => p.category === activeCategory));
  }, [projects, activeCategory]);

  const handleSave = () => { setShowModal(false); setEditProject(null); fetchProjects(); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch { alert('Delete failed'); }
  };

  return (
    <section id="projects" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-[#7c3aed] text-sm tracking-widest uppercase mb-3">What I've built</p>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white">
            My <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Filter row + Admin Add button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-12"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-gray-600" />
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-[#7c3aed] text-white'
                    : 'border border-[rgba(124,58,237,0.25)] text-gray-400 hover:text-white hover:border-[rgba(124,58,237,0.5)]'
                }`}>
                {cat}
              </motion.button>
            ))}
          </div>

          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditProject(null); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white font-semibold text-sm"
            >
              <Plus size={15} /> Add Project
            </motion.button>
          )}
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="gradient-border rounded-2xl h-72 animate-pulse bg-[rgba(124,58,237,0.05)]" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  index={i}
                  isAdmin={isAdmin}
                  onEdit={() => { setEditProject(project); setShowModal(true); }}
                  onDelete={() => handleDelete(project._id || project.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No projects in this category yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <ProjectModal
            project={editProject}
            onClose={() => { setShowModal(false); setEditProject(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
