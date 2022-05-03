import puppeteer, { Browser, Page } from 'puppeteer';
import urls from '../utils/urls';
import downloadFile from '../utils/download-file';
import { ECommerceResponse, IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';
import { fleaLogin } from '../actions/login';
import { refObjFromKeys } from '../utils/DOMRefs';
import { handlePublicationError } from '../utils/errors';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { availableEcommerce } from '../utils/ecommerce';

let pubIndex = 0;
// const responseData: any = [];

export const publishInFlea = async (publications: IFBMarketPlacePublication[], lastPage?: Page, lastBrowser?: Browser) => {
  let page = lastPage || {} as Page;
  let browser = lastBrowser || {} as Browser;

  const isHeadless = publications.length <= 5;
  const publication = publications[pubIndex];
  // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
  // const connectedBrowser = await puppeteer.connect({browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/3a4e607c-fa9d-4402-ad87-9da9eea7d7d5'})
  try {
    if (!lastPage) {
      browser = await puppeteer.launch({
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // userDataDir: '/Users/admin/Library/Application Support/Google/Chrome/Profile 7',
        headless: true, // put false to see how the bot work
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      page = await browser.newPage();
      /// accepting alert confirmation
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });
      overridePermissions(browser, urls.flea);
      await page.goto(urls.fleaLogin);
      await fleaLogin(page);
    }

    await page.goto(urls.fleaNewPub);
    // await page.waitForNavigation();
    await page.waitForTimeout(3000);
    // all dom refs for facebook
    const inputRefs = refObjFromKeys.flea;
    await page.waitForSelector(inputRefs.title);

    const whatsappURL = await urls.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ¿Aún está disponible?  \n \n ${publication.image}`);
    // const whatsappURL = 'whatsapp';

    const productDescription = `${publication.description || publication.name} \n \n
    👇👇👇 Puedes pedir este producto por whatsapp presionando este enlace 👇👇👇 \n
${whatsappURL}
    \n \n
${publication.GodWord || 'Recuerda que Jesús te Ama'}`;

    await page.select(inputRefs.categorySelect.selector, inputRefs.categorySelect.value);
    await page.click(inputRefs.state);
    await page.type(inputRefs.title, `${publication.name} | Betuel Tech`);
    await page.type(inputRefs.description, productDescription);
    await page.type(inputRefs.price, publication.price.toString());

    const inputFile = await page.$(inputRefs.uploadImageFileInput);
    await downloadFile(publication.image,
      async (filePath: string) => {
        try {
          // uploading photo to the form
          inputFile && await inputFile.uploadFile(filePath);

          await page.waitForTimeout(3000);

          await page.click(inputRefs.publishButton);
          await page.waitForNavigation();

          if (pubIndex === publications.length - 1) {
            // responseData.push({ url: publicationUrl, id: publicationId });
            pubIndex = 0;
            SocketIoServer.emit(EcommerceEvents.EMIT_PUBLISHED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'published',
                  ecommerce: availableEcommerce.flea,
                },
              ));
            SocketIoServer.emit(EcommerceEvents.EMIT_COMPLETED,
              new ECommerceResponse(
                {
                  publication,
                  status: 'completed',
                  ecommerce: availableEcommerce.flea,
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
                  ecommerce: availableEcommerce.flea,
                },
              ));
            // responseData.push({ url: publicationUrl, id: publicationId });
            publishInFlea(publications, page, browser);
          }
        } catch (err: any) {
          console.log('Error Second Try Catch: ', err);
          handlePublicationError(err, 'freeMarket', () => publishInFlea(publications, page, browser), browser);
        }
      });
  } catch (err: any) {
    console.log('Error First Try Catch: ', err);
    handlePublicationError(err, 'freeMarket', () => publishInFlea(publications, page, browser), browser);
  }
};
