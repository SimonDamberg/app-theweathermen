import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import locRouter from './routes/location';

dotenv.config();

const cors = require('cors')
const app: Express = express();
app.use(express.json());
app.use(cors())
const port = process.env.PORT;

const mongoString = process.env.LOCAL_DATABASE_URL; // PROD_DATABASE_URL
mongoose.set('strictQuery', false);
mongoString && mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use('/location', locRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!');
});

app.get('/health', (req: Request, res: Response) => {
  res.send({ status: 'OK'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});