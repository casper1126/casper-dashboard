import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import ToDoSection from './components/ToDoSection';
import CalendarSection from './components/CalendarSection';
import ExpenseSection from './components/ExpenseSection';
import StockSection from './components/StockSection';

function App() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper for local date string YYYY-MM-DD
  const getLocalToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- Persistence Helpers ---
  const loadState = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  // --- State Management ---
  const [tasks, setTasks] = React.useState(() => loadState('dashboard_tasks', [
    { id: 1, title: 'Complete Math Assignment', subject: 'School', date: getLocalToday(), completed: false, notes: 'Chapter 5, Exercises 1-10' },
    { id: 2, title: 'Buy Groceries', subject: 'Personal', date: getLocalToday(), completed: true, notes: 'Milk, Eggs, Bread' },
    { id: 3, title: 'Team Meeting', subject: 'Work', date: '2025-11-25', completed: false, notes: 'Prepare slides' },
  ]));

  const [expenses, setExpenses] = React.useState(() => loadState('dashboard_expenses', [
    { id: 1, date: getLocalToday(), category: 'Food', amount: 150, note: 'Lunch box (便當)', paymentMethod: 'Cash' },
    { id: 2, date: getLocalToday(), category: 'Transportation', amount: 30, note: 'MRT', paymentMethod: 'EasyCard' },
    { id: 3, date: '2025-11-18', category: 'Top-up', amount: 500, note: 'EasyCard (悠遊卡)', paymentMethod: 'Cash' },
  ]));

  // Stock Transactions: { id, date, type: 'Buy'|'Sell', symbol, quantity, price }
  const [stockTransactions, setStockTransactions] = React.useState(() => {
    const saved = localStorage.getItem('dashboard_stock_transactions'); // Use the correct key
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2023-01-15', type: 'Buy', symbol: '2330', quantity: 1000, price: 500 },
      { id: 2, date: '2023-06-20', type: 'Buy', symbol: '0050', quantity: 500, price: 120 },
      { id: 3, date: '2023-11-10', type: 'Buy', symbol: 'NVDA', quantity: 10, price: 450 }, // US Stock Example
      { id: 4, date: '2023-12-05', type: 'Buy', symbol: 'TSLA', quantity: 15, price: 240 }, // US Stock Example
      { id: 5, date: '2024-02-01', type: 'Sell', symbol: '2330', quantity: 200, price: 600 }
    ];
  });

  // --- View State (Lifted for Calendar & Expense Linkage) ---
  const [currentViewDate, setCurrentViewDate] = React.useState(new Date());

  // --- Effects ---
  React.useEffect(() => { localStorage.setItem('dashboard_tasks', JSON.stringify(tasks)); }, [tasks]);
  React.useEffect(() => { localStorage.setItem('dashboard_expenses', JSON.stringify(expenses)); }, [expenses]);
  React.useEffect(() => { localStorage.setItem('dashboard_stock_transactions', JSON.stringify(stockTransactions)); }, [stockTransactions]);

  // --- Handlers ---
  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTaskDate = (id, newDate) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, date: newDate } : t));
  };

  // Expense Handlers
  const addExpense = (newExpense) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Stock Transaction Handlers
  const addStockTransaction = (transaction) => {
    setStockTransactions([...stockTransactions, { ...transaction, id: Date.now() }]);
  };

  const updateStockTransaction = (updatedTransaction) => {
    setStockTransactions(stockTransactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const deleteStockTransaction = (id) => {
    setStockTransactions(stockTransactions.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <header className="section-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <LayoutDashboard size={32} color="var(--primary)" />
            Casper's Dashboard
          </h1>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>{today}</p>
        </div>
      </header>

      <main>
        <ToDoSection
          tasks={tasks}
          onAdd={addTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={updateTask}
        />
        <CalendarSection
          tasks={tasks}
          onAdd={addTask}
          onUpdateTask={updateTaskDate}
          currentViewDate={currentViewDate}
          onDateChange={setCurrentViewDate}
        />
        <ExpenseSection
          expenses={expenses}
          onAdd={addExpense}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
          currentViewDate={currentViewDate}
        />
        <StockSection
          transactions={stockTransactions}
          onAddTransaction={addStockTransaction}
          onUpdateTransaction={updateStockTransaction}
          onDeleteTransaction={deleteStockTransaction}
        />
      </main>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2025 Personal Productivity Dashboard</p>
      </footer>
    </div>
  );
}

export default App;
