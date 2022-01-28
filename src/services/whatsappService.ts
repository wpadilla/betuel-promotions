import path from 'path';
import fs from 'fs';
import { Client } from 'whatsapp-web.js';

let whatsappClient: Client;

export const getClient = (): Client => {
  console.log('Getting Whatsapp Client...');
  if (whatsappClient) {
    console.log('¡Client already exist!');
    return whatsappClient;
  }

  try {
    // Path where the session data will be stored
    const SESSION_FILE_PATH = path.join(__dirname, '/../data/whatsappSession.json');
    //
    // // Load the session data if it has been previously saved
    let sessionData;
    if (fs.existsSync(SESSION_FILE_PATH)) {
      sessionData = require(SESSION_FILE_PATH);
    }

    whatsappClient = new Client({
      session: sessionData,
    });

    whatsappClient.on('authenticated', (session) => {
      console.log('AUTHENTICATED SUCCESSFULLY');
      sessionData = session;
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    return whatsappClient;
  } catch (err) {
    throw err;
  }
};

export interface IWhatsappPerson {
    number: string,
    name: string,
}

export const sendMessages = async (persons: IWhatsappPerson[], delay: number): Promise<any> => {
  try {
    const client = getClient();
    return Promise.all(persons.map((person, order) => new Promise((resolve) => setTimeout(async () => {
      try {
        await client.sendMessage(`${person.number}@c.us`, `Hola ${person.name}, quiero hacer amigos, me llamo Betuel y me dicen Tech, ¿como te llamas?`);
        resolve({ status: 'success', person });
      } catch (err) {
        resolve({ status: 'fail', person, error: (err as any).message });
      }
    }, delay * order))));
  } catch (err) {
    throw err;
  }
};
