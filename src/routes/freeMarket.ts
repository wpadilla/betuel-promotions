import { Router } from 'express';
import { publishInFreeMarket } from '../services/freeMarketService';

const freeMarketRouter = Router();

freeMarketRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    await publishInFreeMarket([...data], res);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default freeMarketRouter;
