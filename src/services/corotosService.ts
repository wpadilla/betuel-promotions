import puppeteer, { Browser, Page } from 'puppeteer';
import urls from '../utils/urls';
import downloadFile from '../utils/download-file';
import { ECommerceResponse, IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';
import { corotosLogin } from '../actions/login';
import { refObjFromKeys } from '../utils/DOMRefs';
import { handlePublicationError } from '../utils/errors';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { availableEcommerce } from '../utils/ecommerce';

let pubIndex = 0;
// const responseData: any = [];

export const publishInCorotos = async (publications: IFBMarketPlacePublication[], lastPage?: Page, lastBrowser?: Browser) => {
  let page = lastPage || {} as Page;
  let browser = lastBrowser || {} as Browser;
  const isHeadless = publications.length <= 1;
  const publication = publications[pubIndex];

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
      overridePermissions(browser, urls.corotos);
      await page.goto(urls.corotosLogin);
      await corotosLogin(page);
    }
    await page.goto(urls.corotosNewPub);
    // await page.waitForNavigation();
    await page.waitForTimeout(3000);
    // all dom refs for facebook
    const inputRefs = refObjFromKeys.corotos;
    await page.waitForSelector(inputRefs.title);

    const whatsappURL = await urls.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ΒΏAΓΊn estΓ‘ disponible?  \n \n ${publication.image}`);
    // const whatsappURL = 'whatsapp';

    const productDescription = `${publication.description || publication.name} \n \n
    πππ Puedes pedir este producto por whatsapp presionando este enlace πππ \n
${whatsappURL}
    \n \n
${publication.GodWord || 'Recuerda que JesΓΊs te Ama'}`;

    await page.type(inputRefs.title, `${publication.name} | Betuel Tech`);
    await page.type(inputRefs.description, productDescription);
    await page.select(inputRefs.categorySelect.selector, inputRefs.categorySelect.value);
    await page.waitForTimeout(1000);
    await page.select(inputRefs.subCategorySelect.selector,
      inputRefs.subCategorySelect.value);
    await page.click(inputRefs.continueButton);
    await page.waitForTimeout(2000);

    const inputFile = await page.$(inputRefs.uploadImageFileInput);
    await downloadFile(publication.image,
      async (filePath: string) => {
        try {
          // uploading photo to the form
          inputFile && await inputFile.uploadFile(filePath);

          await page.waitForTimeout(3000);

          await page.click(inputRefs.continueButton);
          await page.waitForTimeout(2000);

          await page.select(inputRefs.state.selector, inputRefs.state.value);
          await page.select(inputRefs.delivery.selector, inputRefs.delivery.value);

          await page.click(inputRefs.continueButton);
          await page.waitForTimeout(2000);

          await page.type(inputRefs.price, publication.price.toString());
          await page.select(inputRefs.location.selector, inputRefs.location.value);
          await page.waitForTimeout(1000);
          await page.select(inputRefs.city.selector, inputRefs.city.value);
          await page.waitForTimeout(1000);
          await page.type(inputRefs.sector, 'Las Caobas');

          await page.click(inputRefs.continueButton);
          await page.waitForNavigation();
          // await page.waitForTimeout(2000)

          if (pubIndex === publications.length - 1) {
            // responseData.push({ url: publicationUrl, id: publicationId });
            pubIndex = 0;
            SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'published',
                  ecommerce: availableEcommerce.corotos,
                },
              ));
            SocketIoServer.emit(EcommerceEvents.EMIT_COMPLETED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'completed',
                  ecommerce: availableEcommerce.corotos,
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
                  ecommerce: availableEcommerce.corotos,
                },
              ));
            publishInCorotos(publications, page, browser);
          }
        } catch (err: any) {
          console.log('Error Second Try Catch: ', err);
          handlePublicationError(err, 'corotos', () => publishInCorotos(publications, page, browser), browser);
        }
      });
  } catch (err: any) {
    console.log('Error First Try Catch: ', err);
    handlePublicationError(err, 'corotos', () => publishInCorotos(publications, page, browser), browser);
  }
};
