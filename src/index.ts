import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/assets`));

// app.listen(process.env.API_PORT || 5000, (req: any, res: any) => {
//   res.send('Hellow');
// });
export default app;
