import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Calendar, Settings } from 'lucide-react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                        🇮🇹 Italy Trip
                    </Link>
                    <nav className="flex gap-6">
                        <Link to="/" className="flex items-center gap-1 text-sm font-medium hover:text-[var(--color-primary)]">
                            <Calendar size={18} /> Itinerary
                        </Link>
                        <Link to="/map" className="flex items-center gap-1 text-sm font-medium hover:text-[var(--color-primary)]">
                            <Map size={18} /> Map
                        </Link>
                        <Link to="/admin" className="flex items-center gap-1 text-sm font-medium hover:text-[var(--color-primary)]">
                            <Settings size={18} /> Admin
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 py-8">
                <div className="container">
                    {children}
                </div>
            </main>

            <footer className="py-8 text-center text-gray-400 text-sm">
                <p>© 2025 Family Italy Trip</p>
            </footer>
        </div>
    );
}
