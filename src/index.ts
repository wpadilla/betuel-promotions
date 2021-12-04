import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/assets`));


app.listen(process.env.PORT || 3000,
  () => console.log('Server is running...'));
