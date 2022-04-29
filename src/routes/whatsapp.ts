import { Router } from 'express';
import {
  getClient, IWhatsappPerson, logOut, sendMessages,
} from '../services/whatsappService';
import { SocketIoServer } from '../index';
import { WhatsappEvents } from '../models/enums';
import { WhatsappResponse } from '../models/WhatsappModels';

const whatsappRouter = Router();

whatsappRouter.post('', async (req, res) => {
  try {
    const { start, clientId } = req.body;

    if (!start) {
      await logOut();
      return res.status(200).send(new WhatsappResponse({ status: 'logged out' }));
    }

    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, new WhatsappResponse({ loading: true }));

    const { client, status } = await getClient(clientId);

    if (status !== 'starting') {
      SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: false });
      return res.status(200).send(new WhatsappResponse({ status }));
    }

    client.on(WhatsappEvents.ON_QR, (qrCode) => {
      SocketIoServer.emit(WhatsappEvents.EMIT_QR, new WhatsappResponse({ qrCode }));
    });

    client.on(WhatsappEvents.ON_DISCONNECTED, () => {
      console.log('DISCONNECTED!');
    });

    client.on(WhatsappEvents.ON_READY, async () => {
      SocketIoServer.emit(WhatsappEvents.EMIT_READY, new WhatsappResponse({ status: 'ready' }));
    });

    client.on(WhatsappEvents.ON_MESSAGE, (message: any) => {
      if (message.body === 'ping') {
        message.reply('pong');
      }
    });

    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, new WhatsappResponse({ loading: true }));
    client.initialize().then(() => {
      SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, new WhatsappResponse({ loading: false }));
    });

    res.status(200).send(new WhatsappResponse({ status }));
  } catch (err: Error | any) {
    res.status(500).json({ error: err.message });
  }
});

whatsappRouter.post('/message', (req, res) => {
  try {

    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: true });
    sendMessages(req.body.contacts as IWhatsappPerson[], 5000).then((data) => {
      SocketIoServer.emit('whatsapp-messages-end', { data });
      SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: false });
    });

    res.status(200).send({ status: 'sending...' });
  } catch (error) {
    res.status(500).send({ error });
  }
});
export default whatsappRouter;
