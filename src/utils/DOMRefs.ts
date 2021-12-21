export const facebookDOMRefObjects = {
  title: 'label[aria-label="Título"] input',
  price: 'label[aria-label="Precio"] input',
  description: 'textarea:nth-child(1)',
  tags: 'textarea:nth-child(2)',
  categorySelect: 'label[aria-label="Categoría"]',
  state: 'label[aria-label="Estado"]',
  brand: 'label[aria-label="Marca"]',
  electronicCategory: '.jxo0map8:nth-child(16)',
  stateNew: '.oajrlxb2 .qzhwtbm6.knvmm38d:nth-child(2)',
  inputFIle: '.mkhogb32[type="file"][multiple]',
  publishButton: '[aria-label="Publicar"]',
  nextButton: '[aria-label="Siguiente"]',
  moreOptionsButton: '[aria-label="Más"]:nth-child(3)',
  publicationURL: '.tojvnm2t .j83agx80 a.oajrlxb2:nth-child(7)',
  publishedItemListImg: '.j83agx80 img',
  itemLink: '.o9dq31lf a',
};

export type IDomRefObjectKeys = 'fb' | 'ct';

export type IRefObjectFromKeys = {
  [N in IDomRefObjectKeys]: { [R in string]: string };
}
export const refObjFromKeys: IRefObjectFromKeys = {
  fb: facebookDOMRefObjects,
  ct: facebookDOMRefObjects,
};
