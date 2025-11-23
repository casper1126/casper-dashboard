import React, { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Plus, Filter, RefreshCw, Trash2, Edit2 } from 'lucide-react';

export default function ExpenseSection({ expenses, onAdd, onUpdate, onDelete, currentViewDate }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        amount: '',
        note: '',
        paymentMethod: 'Cash'
    });
    const [editingId, setEditingId] = useState(null);

    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // --- Calculations ---
    // Filter expenses for the selected month/year from Calendar
    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();

    const filteredExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
    });

    const dailyTotal = filteredExpenses
        .filter(e => e.date === formData.date && e.category !== 'Top-up')
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const monthlyTotal = filteredExpenses
        .filter(e => e.category !== 'Top-up')
        .reduce((sum, e) => sum + Number(e.amount), 0);

    // EasyCard Balance Logic
    // Initial Balance (Mock) + Top-ups - EasyCard Spends
    const easyCardBalance = expenses.reduce((balance, e) => {
        if (e.category === 'Top-up') return balance + Number(e.amount);
        if (e.paymentMethod === 'EasyCard') return balance - Number(e.amount);
        return balance;
    }, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount) return;

        const expenseData = { ...formData, amount: Number(formData.amount) };

        if (editingId) {
            onUpdate({ ...expenseData, id: editingId });
            setEditingId(null);
        } else {
            onAdd(expenseData);
        }

        setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'Food',
            amount: '',
            note: '',
            paymentMethod: 'Cash'
        });
    };

    const handleEdit = (expense) => {
        setFormData({
            date: expense.date,
            category: expense.category,
            amount: expense.amount,
            note: expense.note,
            paymentMethod: expense.paymentMethod
        });
        setEditingId(expense.id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'Food',
            amount: '',
            note: '',
            paymentMethod: 'Cash'
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            onDelete(id);
            if (editingId === id) handleCancelEdit();
        }
    };

    // --- Sorting ---
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <section className="section">
            <div className="card-header">
                <h2 className="section-title">💰 Expense Tracker ({currentViewDate.toLocaleDateString('en-US', { month: 'long' })})</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid-layout mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="text-muted text-sm font-bold uppercase mb-1">Daily Total</div>
                    <div className="text-2xl font-bold text-blue-600">NT$ {dailyTotal.toLocaleString()}</div>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="text-muted text-sm font-bold uppercase mb-1">Monthly Total</div>
                    <div className="text-2xl font-bold text-purple-600">NT$ {monthlyTotal.toLocaleString()}</div>
                </div>
                <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="text-muted text-sm font-bold uppercase mb-1">EasyCard Balance</div>
                    <div className="text-2xl font-bold text-green-600">NT$ {easyCardBalance.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid-layout grid-layout-sidebar" style={{ gap: '2.5rem' }}>
                {/* Add/Edit Expense Form */}
                <div className="card h-fit">
                    <h3 className="font-bold mb-4 flex items-center gap-sm">
                        {editingId ? <RefreshCw size={20} /> : <Plus size={20} />}
                        {editingId ? 'Edit Expense' : 'Add Expense'}
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                        <div className="input-group">
                            <label className="label">Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Category</label>
                            <select
                                className="select"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Food">Food</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Daily Items">Daily Items</option>
                                <option value="Top-up">EasyCard Top-up</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Amount (NT$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Payment Method</label>
                            <select
                                className="select"
                                value={formData.paymentMethod}
                                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                            >
                                <option value="Cash">Cash</option>
                                <option value="EasyCard">EasyCard</option>
                                <option value="Credit Card">Credit Card</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Note</label>
                            <input
                                className="input"
                                placeholder="Description..."
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-sm">
                            <button type="submit" className="btn btn-primary w-full">
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Expense List */}
                <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-sm"><TrendingUp size={20} /> Recent Transactions</h3>
                    <div className="scroll-container">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-center w-12">No.</th>
                                    <th className="px-4 py-3 cursor-pointer hover:text-primary" onClick={() => requestSort('date')}>Date</th>
                                    <th className="px-4 py-3 cursor-pointer hover:text-primary" onClick={() => requestSort('category')}>Category</th>
                                    <th className="px-4 py-3">Note</th>
                                    <th className="px-4 py-3 cursor-pointer hover:text-primary" onClick={() => requestSort('paymentMethod')}>Method</th>
                                    <th className="px-4 py-3 text-right cursor-pointer hover:text-primary" onClick={() => requestSort('amount')}>Amount</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedExpenses.map((expense, index) => (
                                    <tr key={expense.id} className={`border-b hover:bg-slate-50 transition-colors ${editingId === expense.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-4 py-3 text-center text-muted text-xs">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{expense.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${expense.category === 'Top-up' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted">{expense.note}</td>
                                        <td className="px-4 py-3">{expense.paymentMethod}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${expense.category === 'Top-up' ? 'text-green-600' : 'text-slate-900'}`}>
                                            {expense.category === 'Top-up' ? '+' : '-'} NT$ {expense.amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(expense)} className="btn-icon btn-ghost text-blue-600 hover:bg-blue-50" title="Edit">
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(expense.id)} className="btn-icon btn-ghost text-red-600 hover:bg-red-50" title="Delete">
                                                    <Filter size={16} style={{ transform: 'rotate(45deg)' }} /> {/* Using Filter as X/Trash placeholder if Trash not imported, but let's fix imports */}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
