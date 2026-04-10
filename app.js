import express from 'express';
import router from './router.js';
import { connectDB } from './connectDB.js';
import { config } from 'dotenv';

config();
const app = express();

app.use(express.json());
app.use('/api', router);

const port = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
});