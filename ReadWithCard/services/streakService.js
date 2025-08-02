import {getDb} from '../db/database';
export const StreakService = {

    async recordDailyStreak(cardsReviewed) {
        const today = new Date().toISOString().split('T')[0];
        const db = getDb();
        const statement = await db.prepareAsync(`
            INSERT OR REPLACE INTO streaks ( streak_date, cards_reviewed)
            VALUES ( $date, $cardsReviewed)
        `);
        
        try {
            await statement.executeAsync({
                $date: today,
                $cardsReviewed: cardsReviewed
            });
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getStreakData() {
        const db = getDb();
        try {
            const today = new Date().toISOString().split('T')[0];
            const statement = await db.prepareAsync(`
                WITH RECURSIVE dates(date) AS (
                    SELECT date('${today}', '-5 days')
                    UNION ALL
                    SELECT date(date, '+1 day')
                    FROM dates
                    WHERE date < date('${today}', '+1 day')
                )
                SELECT 
                    dates.date as streak_date,
                    COALESCE(s.cards_reviewed, 0) as cards_reviewed
                FROM dates
                LEFT JOIN streaks s ON s.streak_date = dates.date
                ORDER BY dates.date ASC
            `);
            
            try {
                const result = await statement.executeAsync();
                return await result.getAllAsync();
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            console.error('Error getting streak data:', error);
            return [];
        }
    },

    async getDailyStreak(date) {
        const db = getDb();
        try {
            const statement = await db.prepareAsync(`
                SELECT cards_reviewed 
                FROM streaks 
                WHERE streak_date = $date
            `);

            try {
                const result = await statement.executeAsync({
                    $date: date
                });
                const data = await result.getFirstAsync();
                return data || { cards_reviewed: 0 };
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            console.error('Error getting daily streak:', error);
            return { cards_reviewed: 0 };
        }
    },

    async getCurrentStreak() {
        const db = getDb();
        try {
            const statement = await db.prepareAsync(`
                WITH RECURSIVE dates AS (
                    SELECT date('now', 'localtime') as date
                    UNION ALL
                    SELECT date(date, '-1 day')
                    FROM dates
                    WHERE EXISTS (
                        SELECT 1 
                        FROM streaks 
                        WHERE streak_date = date(date, '-1 day')
                        AND cards_reviewed > 0
                    )
                )
                SELECT COUNT(*) as streak
                FROM dates d
                WHERE EXISTS (
                    SELECT 1 
                    FROM streaks s
                    WHERE s.streak_date = d.date
                    AND s.cards_reviewed > 0
                )
            `);
            try {
                const result = await statement.executeAsync();
                const { streak } = await result.getFirstAsync();
                return streak || 0;
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            console.error('Error getting current streak:', error);
            return 0;
        }
    },
}