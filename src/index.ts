import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/assets`));

app.get('/products/', (req, res) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.use('*', (req, res) => {
  res.send('<h1>Welcome to your simple server! Awesome right</h1>');
});

app.listen(process.env.API_PORT || 8080,
  () => console.log('Server is running...'));
