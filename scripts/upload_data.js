import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://niuhaltawhrehuwptiwd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWhhbHRhd2hyZWh1d3B0aXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mjk0NTgsImV4cCI6MjA3OTQwNTQ1OH0.5nPziRWa9KajIcPvKfA--tPY9o06bHPcX7iBKNeySJE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
    console.log('Starting upload...');

    const daysData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/days.json'), 'utf-8'));
    const museumsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/museums.json'), 'utf-8'));

    // 1. Upload Museums (Map fields)
    console.log('Uploading museums...');
    const museumsRows = museumsData.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        history: m.history,
        exhibitions: m.exhibitions,
        practical_info: m.practicalInfo // Map camelCase to snake_case
    }));

    const { error: museumError } = await supabase.from('museums').upsert(museumsRows);
    if (museumError) console.error('Error uploading museums:', museumError);

    // 2. Upload Days
    console.log('Uploading days...');
    // Ensure unique days just in case
    const uniqueDays = Array.from(new Map(daysData.map(item => [item.id, item])).values());

    const daysRows = uniqueDays.map(d => ({
        id: d.id,
        date: d.date,
        title: d.title,
        city: d.city,
        accommodation: d.accommodation
    }));

    const { error: dayError } = await supabase.from('days').upsert(daysRows);
    if (dayError) console.error('Error uploading days:', dayError);

    // 3. Upload Events
    console.log('Uploading events...');
    let allEvents = [];
    daysData.forEach(day => {
        day.events.forEach(event => {
            allEvents.push({
                id: event.id,
                day_id: day.id,
                time: event.time,
                description: event.description,
                type: event.type,
                location: event.location,
                details_id: event.detailsId // Map camelCase to snake_case
            });
        });
    });

    // Ensure unique events
    const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());

    const { error: eventError } = await supabase.from('events').upsert(uniqueEvents);
    if (eventError) console.error('Error uploading events:', eventError);

    console.log('Upload complete!');
}

uploadData();
