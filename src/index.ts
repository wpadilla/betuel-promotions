import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import facebookRouter from './routes/facebook';
import corotosRouter from './routes/corotos';
import fleaRouter from './routes/flea';
import freeMarketRouter from './routes/freeMarket';
import whatsappRouter from './routes/whatsapp';
import instagramRouter from './routes/instagram';

config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.get('/products/', (req, res) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.use('/api/facebook', facebookRouter);
app.use('/api/corotos', corotosRouter);

app.use('/api/flea', fleaRouter);
app.use('/api/free-market', freeMarketRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/instagram', instagramRouter);

// app.use('*', (req, res) => {
//   res.send('<h1>Welcome to your simple server! Awesome right</h1>');
// });

app.listen(process.env.PORT || 3000,
  () => console.log(`Server is running at port: ${process.env.PORT || 3000}`));
