import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, X, Edit2, Calendar, Tag, AlignLeft, Filter } from 'lucide-react';

const SUBJECT_COLORS = {
    'School': 'bg-blue-100 text-blue-700',
    'Work': 'bg-purple-100 text-purple-700',
    'Personal': 'bg-green-100 text-green-700',
    'Exam P': 'bg-red-100 text-red-700',
    'Other': 'bg-gray-100 text-gray-700'
};

const getSubjectStyle = (subject) => {
    switch (subject) {
        case 'School': return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
        case 'Work': return { backgroundColor: '#f3e8ff', color: '#7e22ce' };
        case 'Personal': return { backgroundColor: '#dcfce7', color: '#15803d' };
        case 'Exam P': return { backgroundColor: '#fee2e2', color: '#b91c1c' };
        default: return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
};

export default function ToDoSection({ tasks, onAdd, onToggle, onDelete, onEdit }) {
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Completed
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ title: '', subject: 'Personal', date: '', notes: '' });

    const openAddModal = () => {
        setEditingTask(null);
        setFormData({ title: '', subject: 'Personal', date: new Date().toISOString().split('T')[0], notes: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({ title: task.title, subject: task.subject, date: task.date, notes: task.notes || '' });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title) return;

        if (editingTask) {
            onEdit({ ...editingTask, ...formData });
        } else {
            onAdd(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete(id);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchSubject = filterSubject === 'All' || task.subject === filterSubject;
        const matchStatus = filterStatus === 'All' ||
            (filterStatus === 'Active' && !task.completed) ||
            (filterStatus === 'Completed' && task.completed);
        return matchSubject && matchStatus;
    });

    const subjects = ['School', 'Work', 'Personal', 'Exam P', 'Other'];

    return (
        <section className="section">
            <div className="card-header">
                <h2 className="section-title">
                    📝 To-Do List
                </h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={18} /> Add Task
                </button>
            </div>

            {/* Filters Toolbar */}
            <div className="card mb-4" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="flex items-center gap-sm text-muted">
                    <Filter size={16} />
                    <span className="text-sm font-bold">Filters:</span>
                </div>

                <select
                    className="select"
                    style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem' }}
                    value={filterSubject}
                    onChange={e => setFilterSubject(e.target.value)}
                >
                    <option value="All">All Subjects</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    className="select"
                    style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem' }}
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Task List */}
            <div className="grid-layout" style={{ gridTemplateColumns: '1fr' }}>
                {filteredTasks.length === 0 ? (
                    <div className="text-center text-muted py-8" style={{ padding: '3rem' }}>
                        <p>No tasks found matching your filters.</p>
                        <button className="btn btn-ghost mt-4" onClick={() => { setFilterSubject('All'); setFilterStatus('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="card flex items-start justify-between group" style={{ padding: '1.25rem', transition: 'all 0.2s' }}>
                            <div className="flex items-start gap-md w-full">
                                <button
                                    onClick={() => onToggle(task.id)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: task.completed ? 'var(--success)' : 'var(--border-focus)',
                                        marginTop: '0.2rem'
                                    }}
                                >
                                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm mb-1">
                                        <h3 style={{
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            {task.title}
                                        </h3>
                                        <span style={{
                                            ...getSubjectStyle(task.subject),
                                            padding: '0.15rem 0.6rem',
                                            borderRadius: '99px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {task.subject}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-xs text-sm text-muted">
                                        <div className="flex items-center gap-sm">
                                            <Calendar size={14} />
                                            <span>{task.date || 'No Date'}</span>
                                        </div>
                                        {task.notes && (
                                            <div className="flex items-start gap-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                                <AlignLeft size={14} style={{ marginTop: '3px' }} />
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{task.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-sm">
                                <button
                                    className="btn-icon btn-ghost"
                                    onClick={() => openEditModal(task)}
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    className="btn-icon btn-ghost"
                                    onClick={() => handleDelete(task.id)}
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="label">Task Title</label>
                                <input
                                    className="input"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="What needs to be done?"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-md flex-mobile-col">
                                <div className="input-group w-full">
                                    <label className="label">Subject</label>
                                    <select
                                        className="select"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="input-group w-full">
                                    <label className="label">Due Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Notes (Optional)</label>
                                <textarea
                                    className="textarea"
                                    rows="3"
                                    placeholder="Add details..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-md mt-6">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingTask ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
