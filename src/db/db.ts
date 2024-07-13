import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});


const connectDb = async (): Promise<void> => {
  let client: PoolClient;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Current Time:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting...', err.stack);
  } finally {
    if (client) {
      client.release();
    }
  }
};

connectDb();

export default pool