import { Router } from 'express';
import { publishInMarketplace } from '../services/facebook';

const facebookRouter = Router();

facebookRouter.post('', async (req, res) => {
  const data = req.body;
  await publishInMarketplace(data, res);
  // res.status(200).json(data);
});

export default facebookRouter;
