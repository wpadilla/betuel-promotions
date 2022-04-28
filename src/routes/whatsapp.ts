import { Router } from 'express';
import {
  getClient, IWhatsappPerson, logOut, sendMessages,
} from '../services/whatsappService';
import { SocketIoServer } from '../index';
import { WhatsappEvents } from '../models/enums';

const whatsappRouter = Router();

whatsappRouter.post('', async (req, res) => {
  try {
    const { start } = req.body;

    if (!start) {
      await logOut();
      // return res.status(200).send({ status: 'logged out' });
    }

    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: true });

    const { client, initialized, logged } = await getClient();

    if (initialized) {
      SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: false });
      return res.status(200).send({ status: 'started', initialized, logged });
    }

    client.on(WhatsappEvents.ON_QR, (qrCode) => {
      console.log('qr', qrCode);
      SocketIoServer.emit(WhatsappEvents.EMIT_QR, { qrCode });
    });

    client.on(WhatsappEvents.ON_DISCONNECTED, () => {
      console.log('DISCONNECTED!');
      logOut();
    });

    client.on(WhatsappEvents.ON_READY, async () => {
      console.log('ready');
      SocketIoServer.emit(WhatsappEvents.EMIT_READY, { status: 'ready' });
    });

    client.on(WhatsappEvents.ON_MESSAGE, (message: any) => {
      if (message.body === 'ping') {
        message.reply('pong');
      }
    });

    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: true });
    await client.initialize();
    SocketIoServer.emit(WhatsappEvents.EMIT_LOADING, { loading: false });

    res.status(200).send({ status: 'starting...', initialized, logged });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: (err as any).message });
  }
});

whatsappRouter.post('/message', (req, res) => {
  try {
    console.log('contacts', req.body.contacts);

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
