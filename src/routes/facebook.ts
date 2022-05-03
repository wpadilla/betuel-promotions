import { Router } from 'express';
import { publishInMarketplace } from '../services/facebookService';
import { CommonResponse, ECommerceResponse } from '../models/common';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { availableEcommerce } from '../utils/ecommerce';

const facebookRouter = Router();

facebookRouter.post('', async (req, res) => {
  try {
    const data = req.body;
    publishInMarketplace([...data]);
    SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHING,
      new ECommerceResponse(
        { status: 'publishing', ecommerce: availableEcommerce.facebook },
      ));
    res.status(200).json(new CommonResponse({ status: 'started' }));
  } catch (err: Error | any) {
    res.status(500).json(new CommonResponse({
      error: err.message,
    }));
  }
});

export default facebookRouter;
