import { Router } from 'express';
import { publishInFlea } from '../services/fleaService';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { ECommerceResponse } from '../models/common';
import { availableEcommerce } from '../utils/ecommerce';

const fleaRouter = Router();

fleaRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    publishInFlea([...data]);
    SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHING,
      new ECommerceResponse(
        { status: 'publishing', ecommerce: availableEcommerce.flea },
      ));
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default fleaRouter;
