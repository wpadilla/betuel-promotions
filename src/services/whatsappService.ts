import path from 'path';
import fs from 'fs';
import { Client } from 'whatsapp-web.js';
import { SocketIoServer } from '../index';

let whatsappClient: Client | any;
// Path where the session data will be stored
const SESSION_FILE_PATH = path.join(__dirname, '/../data/whatsappSession.json');

export const logOut = () => new Promise((resolve) => {
  SocketIoServer.emit('whatsapp-loading', { loading: true });

  fs.writeFile(SESSION_FILE_PATH, '{}', async (err) => {
    if (whatsappClient) {
      // console.log('¡Client already exist!', await whatsappClient.getState());
      try {
        await whatsappClient.logout();
        await whatsappClient.destroy();
      } catch (err: any) {
        console.log('error at log out', err);
      }
    }
    whatsappClient = undefined;

    if (err) {
      console.error(err);
    } else {
      SocketIoServer.emit('whatsapp-logged-out', { status: 'logged out' });
      setTimeout(() => resolve({ status: 'logged out' }), 1000);
    }

    SocketIoServer.emit('whatsapp-loading', { loading: false });
  });
});

export const getClient = async (): Promise<{ client: Client, initialized?: boolean }> => {
  try {
    console.log('Getting Whatsapp Client...');
    if (whatsappClient && whatsappClient.info) {
      console.log('¡Client already exist!');
      return { client: whatsappClient, initialized: true };
    }

    // // Load the session data if it has been previously saved
    let sessionData;
    if (fs.existsSync(SESSION_FILE_PATH)) {
      const session = require(SESSION_FILE_PATH);
      console.log(session, 'session');
      sessionData = JSON.stringify(session) === '{}' ? undefined : session;
    }

    whatsappClient = new Client({
      session: sessionData,
    });

    whatsappClient.on('authenticated', (session: any) => {
      SocketIoServer.emit('whatsapp-auth-success', session);
      console.log('AUTHENTICATED SUCCESSFULLY');
      sessionData = session;
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    whatsappClient.on('auth_failure', async (error: any) => {
      console.log('AUTHENTICATED FAIL');
      await logOut();
      setTimeout(() => {
        SocketIoServer.emit('whatsapp-auth-fail', { error });
      }, 1000);
    });

    return { client: whatsappClient };
  } catch (err) {
    console.log('Error while getting client:', err);
  }
};

export interface IWhatsappPerson {
    number: string,
    firstName: string,
    lastName: string,
}

export const sendMessages = async (persons: IWhatsappPerson[], delay: number): Promise<any> => {
  try {
    if (whatsappClient) {
      return Promise.all(persons.map((person, order) => new Promise((resolve) => setTimeout(async () => {
        try {
          await whatsappClient.sendMessage(`1${person.number}@c.us`, `Hola ${person.firstName}, quiero hacer amigos, me llamo Betuel y me dicen Tech, ¿como te llamas?`);
          SocketIoServer.emit('whatsapp-message-sent', person);
          resolve({ status: 'success', person });
        } catch (err) {
          SocketIoServer.emit('whatsapp-message-fail', { error: (err as any).message });
          resolve({ status: 'fail', person, error: (err as any).message });
        }
      }, delay * order))));
    }

    return new Promise(() => ({ error: 'No client found' }));
  } catch (err) {
    throw err;
  }
};
