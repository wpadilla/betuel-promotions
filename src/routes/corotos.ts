import { Router } from 'express';
import { publishInCorotos } from '../services/corotosService';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { CommonResponse, ECommerceResponse } from '../models/common';
import { availableEcommerce } from '../utils/ecommerce';

const corotosRouter = Router();

corotosRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    publishInCorotos([...data]);
    SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHING,
      new ECommerceResponse(
        { status: 'publishing', ecommerce: availableEcommerce.corotos },
      ));
    res.status(200).json(new CommonResponse({ status: 'started' }));
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default corotosRouter;
