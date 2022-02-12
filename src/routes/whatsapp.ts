import { Router } from 'express';
import {
  getClient, IWhatsappPerson, logOut, sendMessages,
} from '../services/whatsappService';
import { SocketIoServer } from '../index';

const whatsappRouter = Router();

whatsappRouter.post('', async (req, res) => {
  try {
    const { start } = req.body;

    if (!start) {
      await logOut();
      return res.status(200).send({ status: 'logged out' });
    }

    const { client, initialized } = await getClient();

    client.on('qr', (qrCode) => {
      console.log('qr', qrCode);
      SocketIoServer.emit('whatsapp-qr-code', { qrCode });
    });

    client.on('disconnected', () => {
      console.log('DISCONNECTED!');
      logOut();
    });

    client.on('ready', async () => {
      console.log('ready');
      SocketIoServer.emit('whatsapp-ready', { status: 'ready' });
    });

    client.on('message', (message: any) => {
      if (message.body === 'ping') {
        console.log(message.from);
        message.reply('pong');
      }
    });

    SocketIoServer.emit('whatsapp-loading', { loading: true });
    if (!initialized) {
      console.log('klk initializing')
      await client.initialize();
      SocketIoServer.emit('whatsapp-loading', { loading: false });

    } else {
      SocketIoServer.emit('whatsapp-loading', { loading: false });
    }

    res.status(200).send({ status: !initialized ? 'starting...' : 'started', initialized });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: (err as any).message });
  }
});

whatsappRouter.post('/message', (req, res) => {
  try {
    console.log('contacts', req.body.contacts);

    SocketIoServer.emit('whatsapp-loading', { loading: true });
    sendMessages(req.body.contacts as IWhatsappPerson[], 5000).then((data) => {
      SocketIoServer.emit('whatsapp-messages-end', { data });
      SocketIoServer.emit('whatsapp-loading', { loading: false });
    });

    res.status(200).send({ status: 'sending...' });
  } catch (error) {
    res.status(500).send({ error });
  }
});
export default whatsappRouter;
