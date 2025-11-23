import React from 'react';
import Layout from '../components/Layout';
import DayCard from '../components/DayCard';
import { useData } from '../context/DataContext';

export default function Home() {
  const { days, loading } = useData();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">Italy Family Trip</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          18 Days of History, Art, and La Dolce Vita.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map(day => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>
    </Layout>
  );
}
