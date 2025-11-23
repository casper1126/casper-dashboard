import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [days, setDays] = useState([]);
    const [museums, setMuseums] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from Supabase
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Museums
            const { data: museumsData, error: mError } = await supabase
                .from('museums')
                .select('*')
                .order('id');

            if (mError) throw mError;

            // Map snake_case back to camelCase for app usage
            const formattedMuseums = museumsData.map(m => ({
                id: m.id,
                name: m.name,
                description: m.description,
                history: m.history,
                exhibitions: m.exhibitions,
                practicalInfo: m.practical_info
            }));
            setMuseums(formattedMuseums);

            // 2. Fetch Days
            const { data: daysData, error: dError } = await supabase
                .from('days')
                .select('*')
                .order('id');

            if (dError) throw dError;

            // 3. Fetch Events
            const { data: eventsData, error: eError } = await supabase
                .from('events')
                .select('*')
                .order('time');

            if (eError) throw eError;

            // 4. Nest events into days
            const formattedDays = daysData.map(day => {
                const dayEvents = eventsData
                    .filter(e => e.day_id === day.id)
                    .map(e => ({
                        id: e.id,
                        time: e.time,
                        description: e.description,
                        type: e.type,
                        location: e.location,
                        detailsId: e.details_id
                    }));

                return {
                    ...day,
                    events: dayEvents
                };
            });

            setDays(formattedDays);

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error loading data from cloud. See console.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateDay = async (updatedDay) => {
        // Optimistic update
        setDays(prev => prev.map(d => d.id === updatedDay.id ? updatedDay : d));

        try {
            // 1. Update Day info
            const { error: dayError } = await supabase
                .from('days')
                .update({
                    title: updatedDay.title,
                    city: updatedDay.city,
                    accommodation: updatedDay.accommodation
                })
                .eq('id', updatedDay.id);

            if (dayError) throw dayError;

            // 2. Sync Events
            // Strategy: Get current DB events for this day, find diff
            const { data: dbEvents } = await supabase.from('events').select('id').eq('day_id', updatedDay.id);
            const dbIds = dbEvents.map(e => e.id);
            const newIds = updatedDay.events.map(e => e.id);

            // Identify to delete
            const toDelete = dbIds.filter(id => !newIds.includes(id));
            if (toDelete.length > 0) {
                await supabase.from('events').delete().in('id', toDelete);
            }

            // Identify to upsert
            const toUpsert = updatedDay.events.map(e => ({
                id: e.id,
                day_id: updatedDay.id,
                time: e.time,
                description: e.description,
                type: e.type,
                location: e.location || '',
                details_id: e.detailsId
            }));

            if (toUpsert.length > 0) {
                const { error: upsertError } = await supabase.from('events').upsert(toUpsert);
                if (upsertError) throw upsertError;
            }

        } catch (error) {
            console.error('Error updating day:', error);
            alert('Failed to save changes to cloud!');
            fetchData(); // Revert
        }
    };

    const updateMuseum = async (updatedMuseum) => {
        // Optimistic update
        setMuseums(prev => prev.map(m => m.id === updatedMuseum.id ? updatedMuseum : m));

        try {
            const { error } = await supabase
                .from('museums')
                .update({
                    name: updatedMuseum.name,
                    description: updatedMuseum.description,
                    history: updatedMuseum.history,
                    exhibitions: updatedMuseum.exhibitions,
                    practical_info: updatedMuseum.practicalInfo
                })
                .eq('id', updatedMuseum.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating museum:', error);
            alert('Failed to save museum changes!');
            fetchData(); // Revert
        }
    };

    const resetData = async () => {
        if (!window.confirm("This will reload data from the server. It won't reset the DB to original PDF. To do that, run the upload script again.")) return;
        fetchData();
    };

    return (
        <DataContext.Provider value={{ days, museums, updateDay, updateMuseum, resetData, loading }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
