import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

try {
  db = SQLite.openDatabaseSync('driving.db');
} catch (e) {
  console.warn('Failed to open database:', e);
}

export const initDB = () => {
  if (!db) return;
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score INTEGER,
        timestamp TEXT
      );`
    );
    try { db.execSync(`ALTER TABLE trips ADD COLUMN name TEXT;`); } catch (e) {}
    try { db.execSync(`ALTER TABLE trips ADD COLUMN duration INTEGER;`); } catch (e) {}
    try { db.execSync(`ALTER TABLE trips ADD COLUMN eventsCount INTEGER;`); } catch (e) {}
  } catch (e) {
    console.warn('Failed to init DB:', e);
  }
};

export const saveTrip = (name: string, score: number, duration: number, eventsCount: number) => {
  if (!db) return;
  try {
    const timestamp = new Date().toISOString();
    db.runSync(
      `INSERT INTO trips (name, score, duration, eventsCount, timestamp) VALUES (?, ?, ?, ?, ?);`,
      name,
      score,
      duration,
      eventsCount,
      timestamp
    );
    console.log(`Trip saved with score: ${score}`);
  } catch (e) {
    console.warn('Failed to save trip:', e);
  }
};

export const getAverageScore = (): number => {
  if (!db) return 100;
  try {
    const result = db.getFirstSync<{ avgScore: number }>(`SELECT AVG(score) as avgScore FROM trips;`);
    return result?.avgScore ? Math.round(result.avgScore) : 100;
  } catch (e) {
    console.warn('Failed to get average score:', e);
    return 100;
  }
};

export interface Trip {
  id: number;
  name: string | null;
  score: number;
  duration: number | null;
  eventsCount: number | null;
  timestamp: string;
}

export const getRecentTrips = (limit: number = 2): Trip[] => {
  if (!db) return [];
  try {
    return db.getAllSync<Trip>(`SELECT * FROM trips ORDER BY id DESC LIMIT ?;`, limit);
  } catch (e) {
    console.warn('Failed to get recent trips:', e);
    return [];
  }
};

export const getAllTrips = (): Trip[] => {
  if (!db) return [];
  try {
    return db.getAllSync<Trip>(`SELECT * FROM trips ORDER BY id DESC;`);
  } catch (e) {
    console.warn('Failed to get all trips:', e);
    return [];
  }
};

export const getTripById = (id: number): Trip | null => {
  if (!db) return null;
  try {
    return db.getFirstSync<Trip>(`SELECT * FROM trips WHERE id = ?;`, id);
  } catch (e) {
    console.warn('Failed to get trip by id:', e);
    return null;
  }
};

export const getTotalDuration = (): number => {
  if (!db) return 0;
  try {
    const result = db.getFirstSync<{ total: number }>(`SELECT SUM(duration) as total FROM trips;`);
    return result?.total || 0;
  } catch (e) {
    console.warn('Failed to get total duration:', e);
    return 0;
  }
};

export const getTotalEvents = (): number => {
  if (!db) return 0;
  try {
    const result = db.getFirstSync<{ total: number }>(`SELECT SUM(eventsCount) as total FROM trips;`);
    return result?.total || 0;
  } catch (e) {
    console.warn('Failed to get total events:', e);
    return 0;
  }
};

export const getLast7DaysScores = (): { day: string, score: number }[] => {
  if (!db) return Array(7).fill({ day: '', score: 100 });
  try {
    const trips = db.getAllSync<Trip>(`SELECT score, timestamp FROM trips;`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: { day: string, dateStr: string, scores: number[] }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dateStr: d.toDateString(),
        scores: []
      });
    }

    trips.forEach(trip => {
      const tripDate = new Date(trip.timestamp);
      tripDate.setHours(0, 0, 0, 0);
      const tripDateStr = tripDate.toDateString();
      const dayIndex = days.findIndex(d => d.dateStr === tripDateStr);
      if (dayIndex !== -1) {
        days[dayIndex].scores.push(trip.score);
      }
    });

    return days.map(d => {
      const avg = d.scores.length > 0 ? d.scores.reduce((a, b) => a + b, 0) / d.scores.length : 100;
      return { day: d.day, score: Math.round(avg) };
    });

  } catch (e) {
    console.warn('Failed to get 7 days scores:', e);
    return Array(7).fill({ day: '', score: 100 });
  }
};
