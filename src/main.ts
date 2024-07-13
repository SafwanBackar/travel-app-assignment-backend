import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import zeroCardRouter from './routes/zerocard';
import journeyRouter from './routes/journey';
import locationRouter from './routes/location'
import dotenv from 'dotenv';
dotenv.config();

const host = process.env.HOST ?? '127.0.0.1';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// 
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' http://127.0.0.1:3000"
  );
  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
app.use('/', zeroCardRouter);
app.use('/', journeyRouter);
app.use('/', locationRouter);


app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
