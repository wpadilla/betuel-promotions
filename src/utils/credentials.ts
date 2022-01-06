export interface ICredentials {
  email: string;
  pass: string
}

export type EcommerceTypes = 'facebook' | 'corotos' | 'freeMarket' | 'flea';

export const credentials: { [N in EcommerceTypes] : ICredentials } = {
  facebook: {
    email: 'audsongs@hotmail.com', // fb email, phone, or username
    pass: '15282118', // fb password
  },
  corotos: {
    email: 'audsongs@hotmail.com', // fb email, phone, or username
    pass: 'washicolesten09', // fb password
  },
  freeMarket: {
    email: 'audsongs@hotmail.com', // fb email, phone, or username
    pass: 'washicolesten09', // fb password
  },
  flea: {
    email: 'betueltec@gmail.com', // fb email, phone, or username
    pass: 'washicolesten09', // fb password
  },
};
