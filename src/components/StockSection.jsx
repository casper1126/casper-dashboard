import React, { useState, useMemo } from 'react';
import { TrendingUp, RefreshCw, Plus, DollarSign, PieChart, History, ArrowRightLeft, Trash2, Edit2 } from 'lucide-react';

export default function StockSection({ transactions, onAddTransaction, onUpdateTransaction, onDeleteTransaction }) {
    const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'realized', 'transactions'
    const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], type: 'Buy', symbol: '', quantity: '', price: '' });
    const [editingId, setEditingId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [dataSource, setDataSource] = useState('Live'); // 'Live' or 'Simulated'

    // Realistic defaults for common stocks to use as fallback base
    const DEFAULT_PRICES = {
        '2330': 1030, '0050': 185, '2603': 220, // Taiwan
        'NVDA': 145, 'TSLA': 340, 'AAPL': 225, 'MSFT': 415, 'GOOGL': 175, 'AMZN': 200 // US
    };

    const [marketPrices, setMarketPrices] = useState({ ...DEFAULT_PRICES });

    // --- Real-Time Price Fetching (Yahoo Finance via Proxy) ---
    const fetchLivePrices = async (symbols) => {
        if (symbols.length === 0) return;
        setIsRefreshing(true);

        const newPrices = { ...marketPrices };
        let fetchFailed = false;

        // List of CORS proxies to try in order
        const PROXIES = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url=',
            'https://thingproxy.freeboard.io/fetch/'
        ];

        // Helper to fetch a single ticker with retry across proxies
        const fetchTickerPrice = async (ticker) => {
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;

            for (const proxy of PROXIES) {
                try {
                    const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`);
                    if (!response.ok) continue; // Try next proxy

                    const data = await response.json();
                    const result = data.chart.result?.[0];
                    if (!result || !result.meta) continue;

                    const price = result.meta.regularMarketPrice || result.meta.chartPreviousClose;
                    if (price !== undefined) return price;
                } catch (e) {
                    // Ignore error and try next proxy
                }
            }
            throw new Error('All proxies failed');
        };

        try {
            const promises = symbols.map(async (symbol) => {
                try {
                    let price = null;

                    // Logic for Taiwan Stocks (4-6 digits to support ETFs like 00878)
                    if (/^\d{4,6}$/.test(symbol)) {
                        try {
                            // Attempt 1: Try TWSE (.TW)
                            price = await fetchTickerPrice(`${symbol}.TW`);
                        } catch (errTW) {
                            // Attempt 2: Try OTC (.TWO) if .TW fails
                            try {
                                price = await fetchTickerPrice(`${symbol}.TWO`);
                            } catch (errTWO) {
                                console.warn(`Failed to fetch ${symbol} as .TW or .TWO`);
                            }
                        }
                    } else {
                        // Logic for US/Other Stocks (Direct ticker)
                        price = await fetchTickerPrice(symbol);
                    }

                    if (price !== null) {
                        newPrices[symbol] = price;
                    } else {
                        throw new Error('Price is null');
                    }
                } catch (err) {
                    console.error(`Failed to fetch price for ${symbol}, falling back to mock:`, err);
                    fetchFailed = true;
                    // Fallback: Generate a realistic mock price based on known defaults or previous price
                    // Check if we have a known default for this symbol (normalized to upper case)
                    const symUpper = symbol.toUpperCase();
                    const basePrice = newPrices[symbol] || DEFAULT_PRICES[symUpper] || 100;

                    const change = basePrice * (Math.random() * 0.02 - 0.01); // Smaller fluctuation for fallback
                    newPrices[symbol] = Number((basePrice + change).toFixed(2));
                }
            });

            await Promise.all(promises);
            setMarketPrices(newPrices);
            setLastUpdated(new Date());
            setDataSource(fetchFailed ? 'Simulated (API Error)' : 'Live (Yahoo Finance)');
        } catch (error) {
            console.error("Error fetching stock prices:", error);
            setDataSource('Simulated (System Error)');
        } finally {
            setIsRefreshing(false);
        }
    };

    // Auto-refresh every 60 seconds
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const uniqueSymbols = [...new Set(transactions.map(t => t.symbol))];
            if (uniqueSymbols.length > 0) {
                fetchLivePrices(uniqueSymbols);
            }
        }, 60000); // 60 seconds

        return () => clearInterval(intervalId);
    }, [transactions]);

    // Initial fetch on mount/change
    React.useEffect(() => {
        const uniqueSymbols = [...new Set(transactions.map(t => t.symbol))];
        if (uniqueSymbols.length > 0) {
            fetchLivePrices(uniqueSymbols);
        }
    }, [transactions.length]);

    // --- Logic & Calculations ---
    const { holdings, realizedPLs } = useMemo(() => {
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const currentHoldings = {}; // { symbol: { quantity, totalCost, avgCost } }
        const realized = [];

        sorted.forEach(t => {
            const sym = t.symbol;
            if (!currentHoldings[sym]) currentHoldings[sym] = { quantity: 0, totalCost: 0, avgCost: 0 };

            if (t.type === 'Buy') {
                const cost = Number(t.quantity) * Number(t.price);
                currentHoldings[sym].totalCost += cost;
                currentHoldings[sym].quantity += Number(t.quantity);
                currentHoldings[sym].avgCost = currentHoldings[sym].totalCost / currentHoldings[sym].quantity;
            } else if (t.type === 'Sell') {
                const sellQty = Number(t.quantity);
                const avgCost = currentHoldings[sym].avgCost;
                const costBasis = sellQty * avgCost;
                const proceeds = sellQty * Number(t.price);
                const pl = proceeds - costBasis;

                realized.push({
                    id: t.id,
                    date: t.date,
                    symbol: sym,
                    quantity: sellQty,
                    buyPrice: avgCost,
                    sellPrice: Number(t.price),
                    pl: pl
                });

                currentHoldings[sym].quantity -= sellQty;
                currentHoldings[sym].totalCost -= costBasis;
                // Avg cost doesn't change on sell
            }
        });

        // Filter out zero quantity holdings
        const activeHoldings = Object.entries(currentHoldings)
            .filter(([_, data]) => data.quantity > 0)
            .map(([symbol, data]) => ({
                symbol,
                quantity: data.quantity,
                avgCost: data.avgCost,
                currentPrice: marketPrices[symbol] || data.avgCost // Fallback to cost if no price
            }));

        return { holdings: activeHoldings, realizedPLs: realized.reverse() };
    }, [transactions, marketPrices]);

    const totalInvested = holdings.reduce((sum, h) => sum + (h.quantity * h.avgCost), 0);
    const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);
    const totalUnrealizedPL = totalValue - totalInvested;
    const totalUnrealizedPLPercent = totalInvested > 0 ? (totalUnrealizedPL / totalInvested) * 100 : 0;

    const handleRefresh = () => {
        const uniqueSymbols = [...new Set(transactions.map(t => t.symbol))];
        if (uniqueSymbols.length > 0) {
            fetchLivePrices(uniqueSymbols);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.symbol || !formData.quantity || !formData.price) return;

        const payload = {
            ...formData,
            symbol: formData.symbol.toUpperCase(),
            quantity: Number(formData.quantity),
            price: Number(formData.price)
        };

        if (editingId) {
            onUpdateTransaction({ ...payload, id: editingId });
            setEditingId(null);
        } else {
            onAddTransaction(payload);
        }

        setFormData({ date: new Date().toISOString().split('T')[0], type: 'Buy', symbol: '', quantity: '', price: '' });
    };

    const handleEdit = (t) => {
        setFormData({
            date: t.date,
            type: t.type,
            symbol: t.symbol,
            quantity: t.quantity,
            price: t.price || t.cost // Handle legacy 'cost' field if exists
        });
        setEditingId(t.id);
        setActiveTab('portfolio'); // Switch to form view
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this transaction? This will recalculate your portfolio.')) {
            onDeleteTransaction(id);
            if (editingId === id) setEditingId(null);
        }
    };

    return (
        <section className="section">
            <div className="card-header">
                <h2 className="section-title">📈 Stock Portfolio</h2>
                <div className="flex gap-sm">
                    <button
                        className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('portfolio')}
                    >
                        Portfolio
                    </button>
                    <button
                        className={`btn ${activeTab === 'realized' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('realized')}
                    >
                        Realized P/L
                    </button>
                    <button
                        className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        History
                    </button>
                </div>
            </div>

            {activeTab === 'portfolio' && (
                <>
                    {/* Portfolio Summary */}
                    <div className="grid-layout mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="card bg-slate-900 text-white border-slate-800">
                            <div className="text-slate-400 text-sm font-bold uppercase mb-1">Total Value</div>
                            <div className="text-3xl font-bold">NT$ {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div className="card">
                            <div className="text-muted text-sm font-bold uppercase mb-1">Total Invested</div>
                            <div className="text-2xl font-bold text-slate-700">NT$ {totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div className="card">
                            <div className="text-muted text-sm font-bold uppercase mb-1">Unrealized P/L</div>
                            <div className={`text-2xl font-bold ${totalUnrealizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                                {totalUnrealizedPL >= 0 ? '+' : ''}NT$ {totalUnrealizedPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                <span className="text-sm ml-2 font-medium">
                                    ({totalUnrealizedPL >= 0 ? '+' : ''}{totalUnrealizedPLPercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid-layout grid-layout-sidebar" style={{ gap: '2.5rem' }}>
                        {/* Holdings Table */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-sm"><PieChart size={20} /> Current Holdings</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${dataSource.includes('Live') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {dataSource}
                                    </span>
                                    <button className={`btn btn-sm btn-secondary ${isRefreshing ? 'opacity-75' : ''}`} onClick={handleRefresh}>
                                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>
                            </div>
                            <div className="scroll-container">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted uppercase bg-slate-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3">Symbol</th>
                                            <th className="px-4 py-3 text-right">Qty</th>
                                            <th className="px-4 py-3 text-right">Avg Cost</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-right">Value</th>
                                            <th className="px-4 py-3 text-right">Unrealized P/L</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {holdings.map(stock => {
                                            const marketValue = stock.quantity * stock.currentPrice;
                                            const pl = marketValue - (stock.quantity * stock.avgCost);
                                            const plPercent = (pl / (stock.quantity * stock.avgCost)) * 100;

                                            return (
                                                <tr key={stock.symbol} className="border-b hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-primary">{stock.symbol}</td>
                                                    <td className="px-4 py-3 text-right">{stock.quantity.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right text-muted">{stock.avgCost.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right font-medium">{stock.currentPrice.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right font-bold">{marketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                    <td className={`px-4 py-3 text-right font-bold ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        {pl >= 0 ? '+' : ''}{pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        <div className="text-xs font-normal opacity-80">
                                                            {plPercent.toFixed(2)}%
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {holdings.length === 0 && (
                                            <tr><td colSpan="6" className="text-center py-8 text-muted">No active holdings</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Add/Edit Transaction Form */}
                        <div className="card h-fit">
                            <h3 className="font-bold mb-4 flex items-center gap-sm">
                                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                                {editingId ? 'Edit Transaction' : 'Trade Stock'}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 rounded-md font-bold transition-colors ${formData.type === 'Buy' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}
                                        onClick={() => setFormData({ ...formData, type: 'Buy' })}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 rounded-md font-bold transition-colors ${formData.type === 'Sell' ? 'bg-danger text-white' : 'bg-slate-100 text-slate-500'}`}
                                        onClick={() => setFormData({ ...formData, type: 'Sell' })}
                                    >
                                        Sell
                                    </button>
                                </div>
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
                                    <label className="label">Symbol</label>
                                    <input
                                        className="input"
                                        placeholder="e.g. 2330 or NVDA"
                                        value={formData.symbol}
                                        onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Quantity</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Shares"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Price (NT$)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Price per share"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-sm">
                                    <button type="submit" className={`btn w-full ${formData.type === 'Buy' ? 'btn-primary' : 'btn-danger'}`}>
                                        {editingId ? 'Update Transaction' : (formData.type === 'Buy' ? 'Buy Stock' : 'Sell Stock')}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={() => { setEditingId(null); setFormData({ date: new Date().toISOString().split('T')[0], type: 'Buy', symbol: '', quantity: '', price: '' }); }} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'realized' && (
                <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-sm"><DollarSign size={20} /> Realized Profit / Loss</h3>
                    <div className="scroll-container">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Symbol</th>
                                    <th className="px-4 py-3 text-right">Qty</th>
                                    <th className="px-4 py-3 text-right">Buy Avg</th>
                                    <th className="px-4 py-3 text-right">Sell Price</th>
                                    <th className="px-4 py-3 text-right">Realized P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {realizedPLs.map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 text-muted">{item.date}</td>
                                        <td className="px-4 py-3 font-bold">{item.symbol}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-muted">{item.buyPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">{item.sellPrice.toFixed(2)}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${item.pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {item.pl >= 0 ? '+' : ''}{item.pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                                {realizedPLs.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-8 text-muted">No realized gains/losses yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-sm"><History size={20} /> Transaction History</h3>
                    <div className="scroll-container">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Symbol</th>
                                    <th className="px-4 py-3 text-right">Qty</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => (
                                    <tr key={t.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 text-muted">{t.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${t.type === 'Buy' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold">{t.symbol}</td>
                                        <td className="px-4 py-3 text-right">{t.quantity.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">{(t.price || t.cost).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-medium">{(t.quantity * (t.price || t.cost)).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(t)} className="btn-icon btn-ghost text-blue-600 hover:bg-blue-50" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)} className="btn-icon btn-ghost text-red-600 hover:bg-red-50" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
