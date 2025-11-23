
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, Ticket, Info, History, Palette } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';

export default function MuseumDetail() {
    const { id } = useParams();
    const { museums } = useData();
    const museum = museums.find(m => m.id === id);

    if (!museum) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-400">Museum not found</h2>
                    <Link to="/" className="text-[var(--color-primary)] mt-4 inline-block">← Back to Home</Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <Link to="/" className="text-sm text-gray-500 hover:text-[var(--color-primary)] flex items-center gap-1 mb-4">
                    <ChevronLeft size={16} /> Back to Itinerary
                </Link>
                <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">{museum.name}</h1>
                <p className="text-xl text-gray-600">{museum.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-secondary)]">
                            <History size={20} /> History & Story
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {museum.history || "Information not available."}
                        </p>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-secondary)]">
                            <Palette size={20} /> Highlights & Exhibitions
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {museum.exhibitions || "Information not available."}
                        </p>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow-lg sticky top-24">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Info size={20} /> Practical Info
                        </h3>
                        <div className="space-y-4 text-sm opacity-90">
                            <p className="whitespace-pre-line">{museum.practicalInfo}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <button className="w-full bg-white text-[var(--color-primary)] font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                Get Tickets / Official Site
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
