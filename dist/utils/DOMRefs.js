"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refObjFromKeys = exports.fleaDOMRefObjects = exports.freeMarketDOMRefObjects = exports.corotosDOMRefObjects = exports.facebookDOMRefObjects = void 0;
exports.facebookDOMRefObjects = {
    title: 'label[aria-label="Título"] input',
    price: 'label[aria-label="Precio"] input',
    description: 'textarea:nth-child(2)',
    tags: 'textarea:nth-child(1)',
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
exports.corotosDOMRefObjects = {
    title: '#listing_title',
    price: '#listing_price',
    description: '#listing_description',
    categorySelect: { selector: '#listing_category_id', value: '8' },
    subCategorySelect: { selector: '#listing_sub_category_id', value: '60' },
    continueButton: '.wizard__actions-button .button:nth-child(2)',
    state: { selector: '#listing_condition_input .select-field', value: '57' },
    delivery: { selector: '#listing_has_delivery_input .select-field', value: '15' },
    location: { selector: '#listing_province_id', value: '29' },
    city: { selector: '#listing_borough_id', value: '71' },
    uploadImageFileInput: '#select_product_image',
    sector: '.vs__search',
};
exports.freeMarketDOMRefObjects = {
    title: '#listing_title',
    price: '#listing_price',
    description: '#listing_description',
    categorySelect: { selector: '#listing_category_id', value: '8' },
    subCategorySelect: { selector: '#listing_sub_category_id', value: '60' },
    continueButton: '.wizard__actions-button .button:nth-child(2)',
    state: { selector: '#listing_condition_input .select-field', value: '57' },
    delivery: { selector: '#listing_has_delivery_input .select-field', value: '15' },
    location: { selector: '#listing_province_id', value: '29' },
    city: { selector: '#listing_borough_id', value: '71' },
    sector: '.vs__search',
};
exports.fleaDOMRefObjects = {
    title: '#articulo',
    price: '#precio',
    description: '#descripcion',
    categorySelect: { selector: '#categoria', value: '2-23' },
    subCategorySelect: { selector: '#listing_sub_category_id', value: '60' },
    continueButton: '.wizard__actions-button .button:nth-child(2)',
    state: '#nuevo',
    uploadImageFileInput: '#fotos',
    publishButton: 'input[type="submit"]',
};
exports.refObjFromKeys = {
    facebook: exports.facebookDOMRefObjects,
    corotos: exports.corotosDOMRefObjects,
    freeMarket: exports.freeMarketDOMRefObjects,
    flea: exports.fleaDOMRefObjects,
};
//# sourceMappingURL=DOMRefs.js.map