import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Hotel, Star } from 'lucide-react';

// Helper to parse date string "2/06 (五)" -> { date: "02/06", weekday: "Friday" }
const parseDate = (dateStr) => {
    // Default fallback
    let date = dateStr;
    let weekday = '';

    // Try to match "M/DD (W)" format
    const match = dateStr.match(/(\d{1,2}\/\d{1,2})\s*\((.)\)/);
    if (match) {
        date = match[1].padStart(5, '0'); // Ensure 02/06 format
        const w = match[2];
        const map = {
            '一': 'Monday', '二': 'Tuesday', '三': 'Wednesday',
            '四': 'Thursday', '五': 'Friday', '六': 'Saturday', '日': 'Sunday'
        };
        weekday = map[w] || '';
    }
    return { date, weekday };
};

// Helper to get summary (first visit/activity or first event)
const getSummary = (events) => {
    if (!events || events.length === 0) return 'No events scheduled';

    // Priority: visit > activity > others
    const mainEvent = events.find(e => e.type === 'visit') ||
        events.find(e => e.type === 'activity') ||
        events[0];

    // Clean up description (remove time if present in desc, though usually it's separate)
    return mainEvent.description;
};

export default function DayCard({ day }) {
    const { date, weekday } = parseDate(day.date);
    const summary = getSummary(day.events);

    return (
        <Link to={`/day/${day.id}`} className="block h-full group">
            <div className="bg-white h-full rounded-3xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out overflow-hidden border border-gray-100 flex flex-col">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-[var(--color-primary)]">Day {day.id}</span>
                        <span className="text-gray-300">|</span>
                        <span>{date}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 font-medium">{weekday}</span>
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col gap-4">

                    {/* City */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">City</p>
                            <p className="font-semibold text-gray-800 leading-tight">{day.city.split('：')[0]}</p>
                        </div>
                    </div>

                    {/* Hotel */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-green-50 text-green-600 rounded-lg shrink-0">
                            <Hotel size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Hotel</p>
                            <p className="font-medium text-gray-700 text-sm leading-tight line-clamp-2">
                                {day.accommodation || 'TBD'}
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-2 pt-4 border-t border-gray-50">
                        <div className="flex items-start gap-2">
                            <Star size={16} className="text-[var(--color-accent)] mt-0.5 fill-current" />
                            <p className="text-sm font-medium text-gray-600 italic">
                                "{summary}"
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
}
