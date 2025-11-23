import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Edit2, Save, X, MapPin } from 'lucide-react';

export default function AdminDashboard() {
    const { days, museums, updateDay, updateMuseum, resetData } = useData();
    const [expandedDay, setExpandedDay] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingMuseum, setEditingMuseum] = useState(null);

    // New Event State
    const [newEvent, setNewEvent] = useState({ time: '', description: '', type: 'activity' });

    const handleAddEvent = (dayId) => {
        const day = days.find(d => d.id === dayId);
        const newEventObj = {
            id: Date.now(),
            ...newEvent
        };
        const updatedDay = { ...day, events: [...day.events, newEventObj].sort((a, b) => a.time.localeCompare(b.time)) };
        updateDay(updatedDay);
        setNewEvent({ time: '', description: '', type: 'activity' });
    };

    const handleDeleteEvent = (dayId, eventId) => {
        if (!window.confirm('Delete this event?')) return;
        const day = days.find(d => d.id === dayId);
        const updatedDay = { ...day, events: day.events.filter(e => e.id !== eventId) };
        updateDay(updatedDay);
    };

    const handleSaveMuseum = (e) => {
        e.preventDefault();
        updateMuseum(editingMuseum);
        setEditingMuseum(null);
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">Itinerary Manager</h1>
                <button onClick={() => { if (window.confirm('Reset all data to default?')) resetData() }} className="text-sm text-red-500 underline">
                    Reset Data
                </button>
            </div>

            <div className="space-y-6">
                {days.map(day => (
                    <div key={day.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div
                            className="p-4 flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100"
                            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-[var(--color-primary)]">Day {day.id}</span>
                                <span className="text-gray-600">{day.date} - {day.city}</span>
                            </div>
                            <span className="text-sm text-gray-400">{day.events.length} events</span>
                        </div>

                        {expandedDay === day.id && (
                            <div className="p-6 border-t border-gray-200">
                                {/* Add Event Form */}
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg flex gap-2 items-end">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Time</label>
                                        <input
                                            type="time"
                                            className="p-2 border rounded"
                                            value={newEvent.time}
                                            onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold mb-1">Description</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            placeholder="Activity description..."
                                            value={newEvent.description}
                                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Type</label>
                                        <select
                                            className="p-2 border rounded"
                                            value={newEvent.type}
                                            onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                        >
                                            <option value="activity">Activity</option>
                                            <option value="transport">Transport</option>
                                            <option value="meal">Meal</option>
                                            <option value="visit">Visit</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleAddEvent(day.id)}
                                        className="bg-[var(--color-primary)] text-white p-2 rounded hover:opacity-90"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Events List */}
                                <div className="space-y-2">
                                    {day.events.map(event => (
                                        <div key={event.id} className="flex items-center justify-between p-3 bg-white border rounded hover:shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-sm text-gray-500">{event.time}</span>
                                                <span className="font-medium">{event.description}</span>
                                                {event.detailsId && (
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                        Museum Linked
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {event.detailsId && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const m = museums.find(m => m.id === event.detailsId);
                                                            if (m) setEditingMuseum(m);
                                                        }}
                                                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                                        title="Edit Museum Content"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteEvent(day.id, event.id)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Museum Modal */}
            {editingMuseum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit Museum Content</h2>
                            <button onClick={() => setEditingMuseum(null)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveMuseum} className="space-y-4">
                            <div>
                                <label className="block font-bold mb-1">Name</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    value={editingMuseum.name}
                                    onChange={e => setEditingMuseum({ ...editingMuseum, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={editingMuseum.description}
                                    onChange={e => setEditingMuseum({ ...editingMuseum, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-1">History</label>
                                <textarea
                                    className="w-full p-2 border rounded h-32"
                                    value={editingMuseum.history}
                                    onChange={e => setEditingMuseum({ ...editingMuseum, history: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-1">Exhibitions</label>
                                <textarea
                                    className="w-full p-2 border rounded h-32"
                                    value={editingMuseum.exhibitions}
                                    onChange={e => setEditingMuseum({ ...editingMuseum, exhibitions: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-1">Practical Info</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={editingMuseum.practicalInfo}
                                    onChange={e => setEditingMuseum({ ...editingMuseum, practicalInfo: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setEditingMuseum(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
