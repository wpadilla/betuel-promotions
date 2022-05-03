import puppeteer, { Browser, Page } from 'puppeteer';
import urls from '../utils/urls';
import downloadFile from '../utils/download-file';
import { ECommerceResponse, IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';
import { facebookLogin } from '../actions/login';
import { refObjFromKeys } from '../utils/DOMRefs';
import { handlePublicationError } from '../utils/errors';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { availableEcommerce } from '../utils/ecommerce';

let pubIndex = 0;
const defaultTags = 'Betuel Tech\n Betuel\n Dios\n Cristo\n tecnologia\n accesorios\n wireless\n bluetooth\n inalambrico\n acesorios de celulares\n audifonos\n bocina\n sonido\n entretenimiento\n oferta\n barato\n calidad\n';

export const publishInMarketplace = async (publications: IFBMarketPlacePublication[], lastPage?: Page, lastBrowser?: Browser) => {
  const publication = publications[pubIndex];
  const isHeadless = publications.length <= 1;

  let page = lastPage || {} as Page;
  let browser = lastBrowser || {} as Browser;
  try {
    if (!lastPage) {
      browser = await puppeteer.launch({
        headless: true, // put false to see how the bot work
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      page = await browser.newPage();
      overridePermissions(browser, urls.facebook);
      await page.goto(`${urls.facebook}login`);

      await facebookLogin(page);
      await page.waitForTimeout(3000);
    }

    page.goto(urls.facebookMarketPlace);
    await page.waitForTimeout(3000);

    // TESTING
    // await page.goto('https://www.facebook.com/marketplace/you/selling');
    // await page.waitForTimeout(3000);
    //

    // all dom refs for facebook
    const inputRefs = refObjFromKeys.facebook;
    const inputFile = await page.$(inputRefs.inputFIle);
    await page.waitForSelector(inputRefs.title);

    const whatsappURL = await urls.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ¿Aún está disponible?  \n \n ${publication.image}`);
    // const whatsappURL = 'whatsapp';

    const productDescription = `${publication.description || publication.name} \n \n
    👇👇👇 Puedes pedir este producto por whatsapp presionando este enlace 👇👇👇 \n
${whatsappURL}
    \n \n
${publication.GodWord || 'Recuerda que Jesús te Ama'}`;
    await downloadFile(publication.image,
      async (filePath: string) => {
        try {
          // uploading photo to the form
          inputFile && await inputFile.uploadFile(filePath);
          await page.type(inputRefs.title, `${publication.name} | Betuel Tech`);
          await page.type(inputRefs.price, publication.price.toString());
          // selecting state
          await page.click(inputRefs.state);
          await page.waitForTimeout(2000);
          // selecting Nuevo state
          await page.evaluate(() => {
            (document.querySelectorAll('[role="listbox"] .oajrlxb2 .qzhwtbm6.knvmm38d')[0] as any).click();
          });

          await page.type(inputRefs.description, productDescription);
          await page.type(inputRefs.tags, publication.tags || defaultTags);
          // await fillMultipleInputs(page, {
          //   title: publication.title,
          //   price: publication.price,
          //   description: publication.description,
          //   tags: publication.tags,
          // }, 'fb');

          await page.click(inputRefs.categorySelect);

          // selecting electronic product category
          await page.evaluate(() => {
            (document.querySelectorAll('.jxo0map8')[15] as any).click();
          });

          await page.click(inputRefs.nextButton);
          await page.waitForTimeout(3000);

          // selecting all groups to publish the product
          await page.evaluate(() => {
            Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item: any) => item && item.click());
          });

          // publishing the article
          await page.click(inputRefs.publishButton);
          await page.waitForNavigation();
          await page.waitForTimeout(1000);
          // await page.waitForNetworkIdle();
          // await page.evaluate(() =>
          // (document.querySelectorAll('[aria-label="Más"]')[2] as any).click());
          // await page.waitForTimeout(2000);
          // await page.click(inputRefs.publishedItemListImg);
          // await page.waitForNetworkIdle();
          // await page.waitForTimeout(1000);
          //
          // const publicationUrl: string = (
          // await page.$eval(inputRefs.itemLink, (item: any) => item.href)) || '';
          //
          // // extracting the publicationID from the publicationUrl.split('/')
          // const publicationId = publicationUrl ?
          // publicationUrl.split('/')[publicationUrl.split('/').length - 2] : 0;

          if (pubIndex === publications.length - 1) {
            // responseData.push({ url: publicationUrl, id: publicationId });
            pubIndex = 0;
            SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'published',
                  ecommerce: availableEcommerce.facebook,
                },
              ));
            SocketIoServer.emit(EcommerceEvents.EMIT_COMPLETED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'completed',
                  ecommerce: availableEcommerce.facebook,
                },
              ));
            browser.close();
          } else {
            pubIndex += 1;
            SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'published',
                  ecommerce: availableEcommerce.facebook,
                },
              ));

            publishInMarketplace(publications, page, browser);
          }
        } catch (err: any) {
          console.log('Error Second Try Catch: ', err);
          handlePublicationError(err, availableEcommerce.facebook,
            () => publishInMarketplace(publications, page, browser), browser);
        }
      });
  } catch (err: any) {
    console.log('Error First Try Catch: ', err);
    handlePublicationError(err, availableEcommerce.facebook,
      () => publishInMarketplace(publications, page, browser), browser);
  }
};

// {
//   "_id":"61b0c6893aca9300088f4dc7",
//     "description":"ESPECIFICACIONES:\n-Compatible con iOS y Android\n-Recibe y realiza llamadas\n-Notifica redes sociales\n-Corona usca teléfono móvil, interruptor de modo dual, música Bluetooth",
//     "name":"Bocina Bluetooth Aprueba de Agua ",
//     "GodWord":"Sonríe, Jesús te ama",
//     "price":3095,
//     "cost":1820,
//     "productImage":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "image":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "flyerOptions":"{\"width\":277,\"height\":354,\"x\":114,\"y\":23,\"fontSize\":37}",
//     "__v":0
// },
// {
//   "_id":"61b0c6893aca9300088f4dc7",
//     "description":"ESPECIFICACIONES:\n-Compatible con iOS y Android\n-Recibe y realiza llamadas\n-Notifica redes sociales\n-Corona usca teléfono móvil, interruptor de modo dual, música Bluetooth",
//     "name":"Bocina Bluetooth Aprueba de Agua ",
//     "GodWord":"Sonríe, Jesús te ama",
//     "price":3095,
//     "cost":1820,
//     "productImage":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "image":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "flyerOptions":"{\"width\":277,\"height\":354,\"x\":114,\"y\":23,\"fontSize\":37}",
//     "__v":0
// }
