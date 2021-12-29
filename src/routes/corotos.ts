import { Router } from 'express';
import { publishInCorotos } from '../services/corotosService';

const corotosRouter = Router();

corotosRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    await publishInCorotos([...data], res);
    // res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default corotosRouter;
