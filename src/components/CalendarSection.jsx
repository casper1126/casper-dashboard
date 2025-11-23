import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X } from 'lucide-react';

const SUBJECT_COLORS = {
    'School': '#3b82f6', // blue-500
    'Work': '#a855f7', // purple-500
    'Personal': '#22c55e', // green-500
    'Exam P': '#ef4444', // red-500
    'Other': '#6b7280' // gray-500
};

export default function CalendarSection({ tasks, onAdd, onUpdateTask, currentViewDate, onDateChange }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => onDateChange(new Date(year, month - 1, 1));
    const handleNextMonth = () => onDateChange(new Date(year, month + 1, 1));

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
            days.push(<div key={`empty-${i}`} className="calendar-day-card empty" />);
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
                    className={`calendar-day-card active-month ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(day)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                >
                    <div className="flex flex-col items-center w-full">
                        <span style={{
                            fontWeight: isToday ? 'bold' : '500',
                            color: isToday ? 'white' : 'var(--color-text)',
                            width: '24px', height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: isToday ? 'var(--color-primary)' : 'transparent',
                            marginBottom: '4px',
                            fontSize: '0.9rem'
                        }}>
                            {day}
                        </span>

                        {/* Task Indicators - Text for better visibility */}
                        <div className="flex flex-col gap-1 w-full mt-1 overflow-hidden">
                            {dayTasks.slice(0, 3).map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        fontSize: '0.6rem',
                                        padding: '2px 4px',
                                        borderRadius: '3px',
                                        backgroundColor: SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['Other'],
                                        color: 'white',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: '1',
                                        textAlign: 'center'
                                    }}
                                >
                                    {task.title}
                                </div>
                            ))}
                            {dayTasks.length > 3 && (
                                <div style={{ fontSize: '0.6rem', color: '#999', textAlign: 'center', lineHeight: '1' }}>
                                    +{dayTasks.length - 3}
                                </div>
                            )}
                        </div>
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
                        {currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="btn-icon btn-ghost" onClick={handleNextMonth}><ChevronRight /></button>
                </div>
            </div>

            <div className="card">
                <div className="scroll-container">
                    <div className="calendar-grid" style={{ marginBottom: '0.5rem' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="header-day">{d}</div>
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
