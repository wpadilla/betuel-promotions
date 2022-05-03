import { EcommerceTypes } from './credentials';

export type ECommerceObjectType = {
    [N in EcommerceTypes]: EcommerceTypes;
}
export const availableEcommerce: ECommerceObjectType = {
  facebook: 'facebook',
  corotos: 'corotos',
  flea: 'flea',
  freeMarket: 'freeMarket',
};

export type ECommerceNamesType = { [N in EcommerceTypes]: string}
export const ecommerceNames: ECommerceNamesType = {
  facebook: 'Facebook Marketplace',
  corotos: 'Corotos',
  flea: 'La Pulga Virtual',
  freeMarket: 'Mercado Libre',
};
