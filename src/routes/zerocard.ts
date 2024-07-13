import { Request, Response, Router } from 'express';
import pool from '../db/db'
const router = Router();

router.get('/zerocard/:cardId', async (req: Request, res: Response) => {
    const { cardId } = req.params
    try {
        const client = await pool.connect();
        const getCardId = 'SELECT * FROM zerocard WHERE card_number = $1';
        const values = [cardId];
        const result = await client.query(getCardId, values);
        client.release();
        
        const cardExists = result.rows.length > 0;
        res.status(200).json({ exists: cardExists, zeroCard: result.rows });
      } catch (err) {
        console.error('Error fetching ZeroCard:', err);
        res.status(500).json({ error: 'Error fetching ZeroCard. Please try again later.' });
      }
});

router.patch('/zerocard/:cardId/balance/update', async (req: Request, res: Response) => {
    const { cardId } = req.params
    const { balance, travel_cost } = req.body
    
    try {
        const client = await pool.connect();
        const updateBalanceQuery = `
            UPDATE zerocard
            SET balance = $1
            WHERE card_number = $2;
        `
        const newBalance = balance - travel_cost
        console.log(newBalance, 'newbalance');
        console.log(cardId, "cardid")
        
        const updateValues = [newBalance, cardId];
        const result = await pool.query(updateBalanceQuery, updateValues)
        client.release();
        
        res.status(200).json({ status: 'success' });
      } catch (err) {
        console.error('Error updating ZeroCard:', err);
        res.status(500).json({ error: 'Error updating ZeroCard. Please try again later.' });
      }
});

router.post('/zerocard/create', async (req: Request, res: Response) => {
    const { name, birthDate }: { name: string; birthDate: Date; } = req.body;
    const passengerType = passengerTypeDet(birthDate)    
    const cardNumber: string = generateCardNumber();

    try {
        const client = await pool.connect();

        const insertZeroCardQuery = `
        INSERT INTO zerocard (name, date_of_birth, card_number, passenger_type)
        VALUES ($1, $2, $3, $4)
        RETURNING card_number, passenger_type
        `;
        const values = [name, birthDate, cardNumber, passengerType];
        const insertResult = await client.query(insertZeroCardQuery, values);
        const newZeroCard = insertResult.rows[0];

        res.status(201).json({ message: 'ZeroCard created successfully', zeroCard: newZeroCard });
    } catch (err) {
            console.error('Error creating ZeroCard:', err);
            res.status(500).json({ error: 'Error creating ZeroCard. Please try again later.' });
    }
});


function generateCardNumber(): string {
  // Keeping a simple card generator here.
  return Math.floor(Math.random() * 1000000000).toString().padStart(12, '1');
}

function passengerTypeDet(date_of_birth: Date): string {
    const birthDate: Date = new Date(date_of_birth);
    const today: Date = new Date();

    let age: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) return 'kid';
    else if (age >= 18 && age < 60) return 'adult'
    else return 'senior';
}

export default router;
