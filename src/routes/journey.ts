import { Request, Response, Router } from 'express';
import pool from '../db/db'

const router = Router();

router.get('/travel/history/:cardId', async (req: Request, res: Response) => {
    const { cardId } = req.params
    
    try {
        const client = await pool.connect();
        // Timeframe should have been a datetime field instead of data.
        const getCardId = 'SELECT discount_enabled, from_location FROM travel WHERE card_id = $1 and travel_date = $2 order by id desc limit 1';
        const today = new Date();
        
        const formattedDate = today.toISOString().split('T')[0];
        const values = [cardId, formattedDate];
        
        const result = await client.query(getCardId, values);
        client.release();
        
        res.status(200).json({ travelHistoryByCardId: result.rows });
      } catch (err) {
        console.error('Error fetching ZeroCard:', err);
        res.status(500).json({ error: 'Error fetching ZeroCard. Please try again later.' });
      }
});

router.get('/travel/history', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        
        const getCostandCountDataQuery = 'SELECT SUM(travel_cost) AS total_cost, COUNT(*) FILTER (WHERE discount_enabled = $1) AS discount_enabled_count FROM travel'
        const values = [true];
        const result = await client.query(getCostandCountDataQuery, values);
        client.release();
        
        res.status(200).json({ travelHistory: result.rows });
      } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data. Please try again later.' });
      }
});

router.get('/passenger/history', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        
        const getCostandCountDataQuery = 'SELECT passenger_type, COUNT(*) as count FROM travel GROUP BY passenger_type ORDER BY count DESC, passenger_type ASC;'
        // const values = [true];
        const result = await client.query(getCostandCountDataQuery);
        client.release();
        
        res.status(200).json({ passengerHistory: result.rows });
      } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data. Please try again later.' });
      }
});

router.post('/travel', async (req: Request, res: Response) => {
    
    const { card_id, from_location, to_location, travel_type, travel_cost, discount_enabled }: {
        card_id: string; 
        from_location: string; 
        to_location: string; 
        travel_type: string;
        travel_cost: number;
        discount_enabled: boolean;
      } = req.body;
      
      const travel_date = new Date();
      let passenger_type: string;

      try {
        const fetchPassengerTypeQuery = `SELECT passenger_type FROM zerocard WHERE card_number = $1`
        const fetchResult = await pool.query(fetchPassengerTypeQuery, [card_id]);
        
        if (fetchResult.rows.length === 0) {
            return res.status(404).json({ error: 'ZeroCard not found' });
        }
        passenger_type = fetchResult.rows[0].passenger_type || 'adult'
        const insertJourneyQuery = `
          INSERT INTO travel (card_id, from_location, to_location, travel_type, travel_cost, travel_date, passenger_type, discount_enabled)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        const values = [card_id, from_location, to_location, travel_type, travel_cost, travel_date, passenger_type,  discount_enabled];
        const insertResult = await pool.query(insertJourneyQuery, values);
        const newJourney = insertResult.rows[0];
        
        res.status(201).json({ message: 'Journey created successfully', journey: newJourney, status: 'success' });
      } catch (err) {
            console.error('Error creating Journey:', err);
            res.status(500).json({ error: 'Error creating Journey. Please try again later.' });
      }
    
})

export default router;