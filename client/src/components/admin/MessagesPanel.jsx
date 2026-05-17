import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Trash2, CheckCheck, Eye, Clock, User, AtSign, MailOpen, Inbox } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function MessagesPanel({ onClose, onCountUpdate }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data);
      const unread = res.data.filter(m => !m.read).length;
      onCountUpdate?.(unread);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages(prev => {
        const updated = prev.map(m => m._id === id ? { ...m, read: true } : m);
        onCountUpdate?.(updated.filter(m => !m.read).length);
        return updated;
      });
      if (selected?._id === id) setSelected(prev => ({ ...prev, read: true }));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/contact/mark-all-read');
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
      onCountUpdate?.(0);
      toast.success('All messages marked as read');
    } catch {
      toast.error('Failed to update messages');
    }
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => {
        const updated = prev.filter(m => m._id !== id);
        onCountUpdate?.(updated.filter(m => !m.read).length);
        return updated;
      });
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openMsg = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead(msg._id);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateFull = (d) => {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
        className="gradient-border rounded-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ background: '#0a0a12', maxHeight: '88vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(124,58,237,0.15)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center">
              <Inbox size={16} className="text-[#a78bfa]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg leading-tight">Messages</h2>
              <p className="text-gray-600 text-xs font-mono">
                {messages.length} total
                {unreadCount > 0 && <span className="text-[#a78bfa] ml-1">· {unreadCount} unread</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[rgba(124,58,237,0.25)] text-purple-300 hover:bg-[rgba(124,58,237,0.1)] transition-colors font-medium"
              >
                <CheckCheck size={12} /> Mark all read
              </motion.button>
            )}
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Message list */}
          <div className={`flex flex-col overflow-y-auto border-r border-[rgba(124,58,237,0.08)] flex-shrink-0 ${selected ? 'w-2/5' : 'w-full'}`}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-7 h-7 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-700 gap-3">
                <Mail size={36} className="opacity-30" />
                <p className="font-mono text-sm">No messages yet</p>
              </div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <motion.button
                    key={msg._id}
                    onClick={() => openMsg(msg)}
                    whileHover={{ backgroundColor: 'rgba(124,58,237,0.06)' }}
                    className={`w-full text-left px-4 py-3.5 border-b border-[rgba(124,58,237,0.06)] transition-colors group ${
                      selected?._id === msg._id ? 'bg-[rgba(124,58,237,0.1)]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] flex-shrink-0 mt-1" />
                        )}
                        {msg.read && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                        <span className={`font-medium truncate text-sm ${msg.read ? 'text-gray-400' : 'text-white'}`}>
                          {msg.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-gray-700 text-[10px] font-mono whitespace-nowrap hidden sm:block">
                          {formatDate(msg.createdAt)}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); deleteMsg(msg._id); }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-red-500/60 hover:text-red-400 transition-all rounded"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs truncate ml-3.5 mb-0.5 ${msg.read ? 'text-gray-600' : 'text-gray-400'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-700 truncate ml-3.5">{msg.message}</p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail pane */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-y-auto p-6 min-w-0"
              >
                {/* Subject */}
                <h3 className="font-display font-bold text-white text-lg mb-5 leading-tight">{selected.subject}</h3>

                {/* Meta info */}
                <div className="flex flex-col gap-2.5 mb-6 p-4 rounded-xl bg-white/[0.03] border border-[rgba(124,58,237,0.1)]">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-[rgba(124,58,237,0.15)] flex items-center justify-center flex-shrink-0">
                      <User size={11} className="text-[#a78bfa]" />
                    </div>
                    <span className="text-gray-300 font-medium">{selected.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-[rgba(6,182,212,0.12)] flex items-center justify-center flex-shrink-0">
                      <AtSign size={11} className="text-[#06b6d4]" />
                    </div>
                    <a href={`mailto:${selected.email}`} className="text-[#06b6d4] hover:text-white transition-colors text-sm">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Clock size={11} className="text-gray-500" />
                    </div>
                    <span className="text-gray-500 font-mono text-xs">{formatDateFull(selected.createdAt)}</span>
                  </div>
                  {selected.read && (
                    <div className="flex items-center gap-2.5 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <MailOpen size={11} className="text-emerald-400" />
                      </div>
                      <span className="text-emerald-400 font-mono">Read</span>
                    </div>
                  )}
                </div>

                {/* Message body */}
                <div className="gradient-border rounded-xl p-5 flex-1 mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 flex-shrink-0">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
                  >
                    <Mail size={14} /> Reply
                  </motion.a>
                  <button
                    onClick={() => deleteMsg(selected._id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
