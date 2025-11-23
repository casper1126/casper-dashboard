const fs = require('fs');
const path = require('path');

const rawText = fs.readFileSync(path.join(__dirname, '../src/data/itinerary_raw.txt'), 'utf-8');

const lines = rawText.split('\n');
const days = [];
let currentDay = null;
let currentEvent = null;

const museums = [];
const attractions = [];
const restaurants = [];
const transportation = [];

let eventIdCounter = 1;
let museumIdCounter = 1;

// Helper to detect type
function detectType(text) {
    if (text.includes('火車') || text.includes('高鐵') || text.includes('開車') || text.includes('接送') || text.includes('巴士') || text.includes('飛機')) return 'transport';
    if (text.includes('餐') || text.includes('吃飯') || text.includes('咖啡')) return 'meal';
    if (text.includes('博物館') || text.includes('美術館') || text.includes('參觀') || text.includes('遊覽')) return 'visit';
    return 'activity';
}

lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Match Day Header: Day 1｜2/5 (三) ｜羅馬：抵達與入住
    const dayMatch = line.match(/Day\s+(\d+)｜(.*?)\s*｜(.*?)$/);
    if (dayMatch) {
        if (currentDay) days.push(currentDay);
        currentDay = {
            id: parseInt(dayMatch[1]),
            date: dayMatch[2].trim(),
            title: dayMatch[3].trim(),
            city: dayMatch[3].split('：')[0] || 'Italy',
            accommodation: '',
            events: []
        };
        return;
    }

    // Match Time & Activity: 14:00 抵達羅馬機場
    const timeMatch = line.match(/^(\d{2}:\d{2})\s+(.*)/);
    if (timeMatch && currentDay) {
        const time = timeMatch[1];
        const description = timeMatch[2];
        const type = detectType(description);

        const event = {
            id: eventIdCounter++,
            time: time,
            description: description,
            type: type,
            location: '', // To be filled if possible
            detailsId: null
        };

        // Check for Museum/Attraction
        if (type === 'visit' && (description.includes('博物館') || description.includes('美術館') || description.includes('百花大教堂') || description.includes('競技場'))) {
            const museumId = `m-${museumIdCounter++}`;
            event.detailsId = museumId;
            museums.push({
                id: museumId,
                name: description,
                description: "AI Generated Content Placeholder",
                history: "",
                exhibitions: "",
                practicalInfo: ""
            });
        }

        currentDay.events.push(event);
        return;
    }

    // Match Accommodation
    if (line.startsWith('住宿：') && currentDay) {
        currentDay.accommodation = line.replace('住宿：', '').trim();
        return;
    }

    // Append extra info to last event if it looks like a continuation or detail
    if (currentDay && currentDay.events.length > 0) {
        const lastEvent = currentDay.events[currentDay.events.length - 1];
        // If line looks like a note or detail (not a new time)
        if (!line.match(/^\d{2}:\d{2}/)) {
            // Maybe add to description or a notes field?
            // For now, just ignore or append if it's short?
            // Let's append to description for context
            // lastEvent.description += ` (${line})`;
        }
    }
});

if (currentDay) days.push(currentDay);

// Write files
const dataDir = path.join(__dirname, '../src/data');
fs.writeFileSync(path.join(dataDir, 'days.json'), JSON.stringify(days, null, 2));
fs.writeFileSync(path.join(dataDir, 'museums.json'), JSON.stringify(museums, null, 2));
// Create empty/default files for others
fs.writeFileSync(path.join(dataDir, 'attractions.json'), JSON.stringify(attractions, null, 2));
fs.writeFileSync(path.join(dataDir, 'restaurants.json'), JSON.stringify(restaurants, null, 2));
fs.writeFileSync(path.join(dataDir, 'transportation.json'), JSON.stringify(transportation, null, 2));

console.log(`Parsed ${days.length} days.`);
console.log(`Identified ${museums.length} museums.`);
