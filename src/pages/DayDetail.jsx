import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Hotel } from 'lucide-react';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import { useData } from '../context/DataContext';

export default function DayDetail() {
    const { id } = useParams();
    const { days } = useData();
    const day = days.find(d => d.id === parseInt(id));

    if (!day) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-400">Day not found</h2>
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

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Day {day.id}: {day.title}</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <span className="flex items-center gap-1"><MapPin size={18} /> {day.city}</span>
                            <span className="flex items-center gap-1"><Hotel size={18} /> {day.accommodation || 'No Hotel Info'}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-[var(--color-accent)]">{day.date}</span>
                    </div>
                </div>
            </div>

            <Timeline events={day.events} city={day.city} />
        </Layout>
    );
}
