import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const cors = require('cors')
const app: Express = express();
app.use(cors())
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/health', (req: Request, res: Response) => {
  res.send({ status: 'OK'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});