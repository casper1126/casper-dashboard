import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X } from 'lucide-react';

const SUBJECT_COLORS = {
    'School': '#3b82f6', // blue-500
    'Work': '#a855f7', // purple-500
    'Personal': '#22c55e', // green-500
    'Exam P': '#ef4444', // red-500
    'Other': '#6b7280' // gray-500
};

export default function CalendarSection({ tasks, onAdd, onUpdateTask }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setIsModalOpen(true);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        onAdd({
            title: newTaskTitle,
            date: selectedDate,
            subject: 'Personal',
            description: ''
        });
        setNewTaskTitle('');
    };

    // --- Drag & Drop ---
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'var(--primary-light)';
    };

    const handleDragLeave = (e) => {
        e.currentTarget.style.backgroundColor = 'white';
    };

    const handleDrop = (e, day) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'white';
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (taskId && dateStr) {
            onUpdateTask(taskId, dateStr);
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasks.filter(t => t.date === dateStr);

            // Local date check
            const d = new Date();
            const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const isToday = todayStr === dateStr;

            days.push(
                <div
                    key={day}
                    className="calendar-day card"
                    onClick={() => handleDayClick(day)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                    style={{
                        padding: '0.5rem',
                        minHeight: '100px',
                        borderRadius: 'var(--radius-md)',
                        border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                    }}
                >
                    <div className="flex justify-between items-center">
                        <span style={{
                            fontWeight: isToday ? 'bold' : '500',
                            color: isToday ? 'var(--primary)' : 'var(--text-secondary)',
                            width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%', backgroundColor: isToday ? 'var(--primary-light)' : 'transparent'
                        }}>
                            {day}
                        </span>
                        {dayTasks.length > 0 && (
                            <span className="badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'var(--bg-body)' }}>
                                {dayTasks.length}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-xs mt-1">
                        {dayTasks.map(task => (
                            <div
                                key={task.id}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}
                                style={{
                                    fontSize: '0.75rem', // Slightly larger for readability
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['Other'],
                                    color: 'white',
                                    whiteSpace: 'normal', // Allow text to wrap if needed
                                    overflow: 'visible', // Allow content to be seen
                                    cursor: 'grab',
                                    lineHeight: '1.2',
                                    marginBottom: '2px'
                                }}
                                title={task.title}
                            >
                                {task.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <section className="section">
            <div className="card-header">
                <h2 className="section-title">📅 Calendar</h2>
                <div className="flex items-center gap-md">
                    <button className="btn-icon btn-ghost" onClick={handlePrevMonth}><ChevronLeft /></button>
                    <span className="font-bold text-lg" style={{ minWidth: '140px', textAlign: 'center' }}>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="btn-icon btn-ghost" onClick={handleNextMonth}><ChevronRight /></button>
                </div>
            </div>

            <div className="card">
                <div className="scroll-container">
                    <div className="calendar-grid" style={{ marginBottom: '0.5rem' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-sm font-bold text-muted uppercase">{d}</div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {renderCalendarDays()}
                    </div>
                </div>
                <div className="text-center mt-4 text-sm text-muted italic">
                    * Drag and drop tasks to reschedule
                </div>
            </div>

            {/* Day Details Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost"><X size={24} /></button>
                        </div>

                        <div className="mb-6">
                            <h4 className="label mb-2">Tasks for this day:</h4>
                            <div className="flex flex-col gap-sm">
                                {tasks.filter(t => t.date === selectedDate).length === 0 ? (
                                    <p className="text-muted text-sm">No tasks scheduled.</p>
                                ) : (
                                    tasks.filter(t => t.date === selectedDate).map(task => (
                                        <div key={task.id} className="flex items-center gap-sm p-2 border rounded-md bg-slate-50">
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: SUBJECT_COLORS[task.subject] || 'gray' }} />
                                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleAddTask} className="border-t pt-4">
                            <label className="label">Quick Add Task</label>
                            <div className="flex gap-sm">
                                <input
                                    className="input"
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    placeholder="New task title..."
                                    autoFocus
                                />
                                <button type="submit" className="btn btn-primary"><Plus size={18} /></button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
