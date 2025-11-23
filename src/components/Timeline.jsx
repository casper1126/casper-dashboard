import React from 'react';
import { Clock, MapPin, Train, Utensils, Camera, Info } from 'lucide-react';

const EventIcon = ({ type }) => {
    switch (type) {
        case 'transport': return <Train size={20} />;
        case 'meal': return <Utensils size={20} />;
        case 'visit': return <Camera size={20} />;
        default: return <Info size={20} />;
    }
};

const EventCard = ({ event, city }) => {
    const mapQuery = event.location || event.description;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery + ' ' + city)}`;

    return (
        <div className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0">
            <div className="absolute -left-[11px] top-0 bg-white p-1 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)]">
                <EventIcon type={event.type} />
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-[var(--color-secondary)] font-semibold">
                        <Clock size={16} />
                        {event.time}
                    </div>
                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                        <MapPin size={12} /> Map
                    </a>
                </div>

                <h4 className="text-lg font-bold mb-2">{event.description}</h4>

                {event.detailsId && (
                    <div className="mt-3">
                        <a href={`/museum/${event.detailsId}`} className="text-sm text-[var(--color-primary)] underline underline-offset-2">
                            View Guide & History →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Timeline({ events, city }) {
    return (
        <div className="mt-8">
            {events.map(event => (
                <EventCard key={event.id} event={event} city={city} />
            ))}
        </div>
    );
}
