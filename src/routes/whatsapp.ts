import { Router } from 'express';
import { getClient, IWhatsappPerson, sendMessages } from '../services/whatsappService';

const whatsappRouter = Router();

whatsappRouter.post('', async (req, res) => {
  try {
    const client = getClient();
    console.log('starting');

    // client.on('qr', (qr) => {
    //   console.log(qr);
    //   qrcode.generate(qr, { small: true });
    // });

    const persons: IWhatsappPerson[] = [
      { number: '18294291184', name: 'Betuel Travel' },
      { number: '18094055531', name: 'Williams' },
      { number: '18493846548', name: 'Luz' },
    ];

    client.on('ready', async () => {
      sendMessages(persons, 1000).then((data) => {
        res.send({ status: 'Success', data });
      });
    });

    client.on('message', (message) => {
      if (message.body === 'ping') {
        console.log(message.from);
        message.reply('pong');
      }
    });

    client.initialize();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: (err as any).message });
  }
});

export default whatsappRouter;
