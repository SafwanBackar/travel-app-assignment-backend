import { Request, Response, Router } from 'express';
import { PoolClient, QueryResult } from 'pg';
import pool from '../db/db'

const router = Router();

router.get('/location', async (req: Request, res: Response) => {
    try {
        const client: PoolClient = await pool.connect();
        const result: QueryResult = await client.query('SELECT id, name FROM location');
            
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});


// query to get fair charge. seperate table in case fair changes for certain user type.
router.get('/fair_charge/:passengerType', async (req: Request, res: Response) => {
    const { passengerType } = req.params
    try {
        const client = await pool.connect();
        const getFairCharge = 'SELECT * FROM fair_charge WHERE passenger_type = $1';
        const values = [passengerType];
        const result = await client.query(getFairCharge, values);
        client.release();

        res.status(200).json({ fairCharge: result.rows });
      } catch (err) {
        console.error('Error fetching ZeroCard:', err);
        res.status(500).json({ error: 'Error fetching ZeroCard. Please try again later.' });
      }
});

export default router