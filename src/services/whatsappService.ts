import path from 'path';
import fs from 'fs';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { SocketIoServer } from '../index';
import { AppMessages, WhatsappEvents } from '../models/enums';
import {
  IWhatsappClients, IWhatsappMessage, WhatsappResponse, WhatsappSessionTypes,
} from '../models/WhatsappModels';

const whatsappClient: IWhatsappClients = {} as IWhatsappClients;
// Path where the session data will be stored
const SESSION_FILE_PATH = path.join(__dirname, '/../data/whatsappSession.json');
const WS_DATA_PATH = './dist';

export const logOut = () => new Promise((resolve) => {
  SocketIoServer.emit('whatsapp-loading', { loading: true });

  // fs.writeFile(SESSION_FILE_PATH, '{}', async (err) => {
  //   if (whatsappClient) {
  //     // console.log('¡Client already exist!', await whatsappClient.getState());
  //     try {
  //       await whatsappClient.logout();
  //       await whatsappClient.destroy();
  //     } catch (err: any) {
  //       console.log('error at log out', err);
  //     }
  //   }
  //   whatsappClient = undefined;
  //
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     SocketIoServer.emit('whatsapp-logged-out', { status: 'logged out' });
  //     setTimeout(() => resolve({ status: 'logged out' }), 1000);
  //   }
  //
  //   SocketIoServer.emit('whatsapp-loading', { loading: false });
  // });
});

class ClientResponse extends WhatsappResponse {
  client: Client = {} as any;

  constructor(data: ClientResponse) {
    super(data);
    this.client = data.client;
  }
}

export const getClient = async (sessionId: WhatsappSessionTypes): Promise<ClientResponse> => {
  try {
    const clientId = whatsappClient[sessionId]
        && whatsappClient[sessionId].options.authStrategy.clientId;
    console.log('client id:', clientId);
    if (whatsappClient[sessionId] && whatsappClient[sessionId].info && clientId === sessionId) {
      console.log(AppMessages.CLIENT_EXIST);
      SocketIoServer.emit(WhatsappEvents.EMIT_AUTH_SUCCESS, new WhatsappResponse({ status: 'logged' }));
      return new ClientResponse({ client: whatsappClient[sessionId], status: 'logged' });
    }

    if (whatsappClient[sessionId] && clientId === sessionId) {
      return new ClientResponse({ client: whatsappClient[sessionId], status: 'started' });
    }

    // creation of the client
    whatsappClient[sessionId] = new Client({
      // local auth to store the user data in local for multi-device whatsapp
      authStrategy: new LocalAuth({ clientId: sessionId, dataPath: WS_DATA_PATH }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    whatsappClient[sessionId].on(WhatsappEvents.ON_AUTHENTICATED, () => {
      console.log(AppMessages.AUTHENTICATED);
      SocketIoServer.emit(WhatsappEvents.EMIT_AUTH_SUCCESS, new WhatsappResponse({ status: 'logged' }));
    });

    whatsappClient[sessionId].on(WhatsappEvents.ON_AUTH_FAIL, async (error: any) => {
      console.log(AppMessages.AUTHENTICATION_FAIL);
      await logOut();
      setTimeout(() => {
        SocketIoServer.emit('whatsapp-auth-fail', { error });
      }, 1000);
    });

    return new ClientResponse({ client: whatsappClient[sessionId], status: 'starting' });
  } catch (err) {
    console.log(AppMessages.ERROR_WHILE_GETTING_WS_CLIENT, err);
    throw err;
  }
};

export interface IWhatsappPerson {
    number: string,
    firstName: string,
    lastName: string,
}

export const sendMessages = async (sessionId: WhatsappSessionTypes, persons: IWhatsappPerson[], message: IWhatsappMessage, delay: number): Promise<any> => {
  try {
    if (whatsappClient[sessionId]) {
      return Promise.all(persons.map((person, order) => new Promise(
        (resolve) => setTimeout(async () => {
          try {
            let { text, photo } = message;
            if (text) {
              Object.keys(person).forEach((key) => {
                // @ts-ignore
                text = text.replace(`@${key}`, (person as any)[key]);
              });
            }

            const chatId = `1${person.number}@c.us`;
            if (photo) {
              const foto = photo.split(',')[1];

              // const chat = await whatsappClient[sessionId].getChatById(chatId);
              const media = new MessageMedia('image/png', foto);
              await whatsappClient[sessionId].sendMessage(chatId, media, { caption: text });
              // const ress = await chat.sendMessage(media, { caption: text });
              console.log('segundo console');
            } else {
              await whatsappClient[sessionId].sendMessage(chatId, text);
            }
            SocketIoServer.emit('whatsapp-message-sent', person);
            resolve({ status: 'success', person });
          } catch (err) {
            SocketIoServer.emit('whatsapp-message-fail', { error: (err as any).message });
            resolve({ status: 'fail', person, error: (err as any).message });
          }
        }, delay * order),
      )));
    }

    return new Promise(() => ({ error: 'No client found' }));
  } catch (err) {
    throw err;
  }
};
