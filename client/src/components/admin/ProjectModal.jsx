import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INITIAL = {
  title: '', description: '', longDescription: '', techStack: '',
  githubUrl: '', liveUrl: '', imageUrl: '', category: 'fullstack', featured: false, order: 0
};

export default function ProjectModal({ project, onClose, onSave }) {
  const isEdit = !!project;
  const [form, setForm] = useState(isEdit ? {
    ...project,
    techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack
  } : INITIAL);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean)
      };
      if (isEdit) {
        await api.put(`/projects/${project._id}`, payload);
        toast.success('Project updated!');
      } else {
        await api.post('/projects', payload);
        toast.success('Project added!');
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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
        className="gradient-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#0d0d14' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(124,58,237,0.2)]">
          <h2 className="font-display font-bold text-white text-xl">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {[
            { label: 'Project Title *', name: 'title', placeholder: 'e.g. WhatsApp Chat App' },
            { label: 'Short Description *', name: 'description', placeholder: 'Brief description shown on card' },
            { label: 'GitHub URL', name: 'githubUrl', placeholder: 'https://github.com/...' },
            { label: 'Live URL', name: 'liveUrl', placeholder: 'https://...' },
            { label: 'Image URL', name: 'imageUrl', placeholder: 'https://... (optional)' },
            { label: 'Tech Stack (comma-separated)', name: 'techStack', placeholder: 'React, Node.js, MongoDB, ...' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
              {name === 'description' ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors resize-none"
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white placeholder-gray-600 text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
              >
                {['fullstack', 'frontend', 'backend', 'mobile', 'other'].map(c => (
                  <option key={c} value={c} className="bg-[#0d0d14]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Display Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(124,58,237,0.2)] text-white text-sm outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="sr-only" />
              <div className={`w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-[#7c3aed]' : 'bg-white/10'}`} />
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="text-gray-300 text-sm">Mark as Featured</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[rgba(124,58,237,0.2)]">
          <button onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border border-[rgba(124,58,237,0.25)] text-gray-400 hover:text-white hover:border-[rgba(124,58,237,0.5)] transition-all text-sm font-medium">
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
            {isEdit ? 'Update Project' : 'Add Project'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
