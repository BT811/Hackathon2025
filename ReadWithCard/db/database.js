import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
let db = null;

export const DatabaseService = {
    async initDatabase() {
        try {
            db = await SQLite.openDatabaseAsync('readwithcard.db');
            
            await db.execAsync(`

                CREATE TABLE IF NOT EXISTS decks (
                    deck_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    image_uri TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS viewed_cards (
                    deck_id INTEGER NOT NULL,
                    card_id INTEGER NOT NULL,
                    viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    is_known BOOLEAN NOT NULL DEFAULT 0,      
                    PRIMARY KEY ( card_id, deck_id)
                );

                CREATE TABLE IF NOT EXISTS cards (
                    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    deck_id INTEGER NOT NULL,
                    word TEXT NOT NULL,
                    t_word TEXT,
                    description TEXT,
                    pronunciation TEXT,
                    part_of_speech TEXT,
                    synonyms TEXT,
                    sentence TEXT,
                    image_uri TEXT,
                    right_count INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'NEW' CHECK(status IN ('NEW', 'LEARNING', 'REVIEWING', 'GRADUATED')),
                    last_review TEXT,
                    next_review TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (deck_id) REFERENCES decks (deck_id)
                );

                CREATE TABLE IF NOT EXISTS streaks (
                    streak_date TEXT NOT NULL,
                    cards_reviewed INTEGER DEFAULT 0,
                    PRIMARY KEY (streak_date)
                );
            `);
            console.log('Database initialized successfully');
            return true;
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    },
    async resetDatabase() {
        try {
            if (db) {
                await db.closeAsync();
            }
            
            // Database dosyasını sil
            const dbPath = `${FileSystem.documentDirectory}SQLite/readwithcard.db`;
            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(dbPath);
                console.log('Database file deleted');
            }
            
            // DB reference'ı sıfırla
            db = null;
            
            // Yeniden başlat
            await this.initDatabase();
            console.log('Database reset and reinitialized');
            
        } catch (error) {
            console.error('Error resetting database:', error);
            throw error;
        }
    }

}
export function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call DatabaseService.initDatabase() first.');
    }
    return db;
}