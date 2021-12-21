import { Router } from 'express';
import { publishInMarketplace } from '../services/facebook';

const facebookRouter = Router();

facebookRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    await publishInMarketplace([...data], res);
    // res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default facebookRouter;
