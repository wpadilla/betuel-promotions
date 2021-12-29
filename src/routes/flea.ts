import { Router } from 'express';
import { publishInFlea } from '../services/fleaService';

const fleaRouter = Router();

fleaRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    await publishInFlea([...data], res);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default fleaRouter;
