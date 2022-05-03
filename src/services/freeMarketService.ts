import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import urls from '../utils/urls';
import downloadFile from '../utils/download-file';
import { IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';
import { freeMarketLogin } from '../actions/login';
import { refObjFromKeys } from '../utils/DOMRefs';
import { handlePublicationError } from '../utils/errors';
import bypass from '../actions/captcha/captchaBypasser';

puppeteer.use(RecaptchaPlugin({
  provider: {
    fn: bypass,
    // fn: '2captcha',
    // token: '4e7344ed75a2640f04e52b303a8bdfeb',
  },
}));


let pubIndex = 0;
// const responseData: any = [];

export const publishInFreeMarket = async (publications: IFBMarketPlacePublication[], res: any, lastPage?: Page, lastBrowser?: Browser) => {
  let page = lastPage || {} as Page;
  let browser = lastBrowser || {} as Browser;

  const isHeadless = publications.length <= 1;
  const publication = publications[pubIndex];
  // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
  // const connectedBrowser = await puppeteer.connect({browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/3a4e607c-fa9d-4402-ad87-9da9eea7d7d5'})
  try {
    if (!lastPage) {
      browser = await puppeteer.launch({
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // userDataDir: '/Users/admin/Library/Application Support/Google/Chrome/Profile 7',
        headless: isHeadless, // put false to see how the bot work
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
      overridePermissions(browser, urls.freeMarket);
      await page.goto(urls.freeMarketLogin);
      await freeMarketLogin(page);
      // await page.goto('http://democaptcha.com/demo-form-eng/hcaptcha.html');
      // await page.waitForTimeout(3000);
      // page.solveRecaptchas().then((res: any) => {
      //   console.log(res, 'solved recapcha?');
      // }).catch((err: any) => console.log(err, 'captcha error!!!'));
    }
    await page.waitForTimeout(30000);

    await page.goto(urls.freeMarket);
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
            browser.close();
            res.status(200).json({ success: true });
          } else {
            pubIndex += 1;
            // responseData.push({ url: publicationUrl, id: publicationId });
            publishInFreeMarket(publications, res, page, browser);
          }
        } catch (err: any) {
          console.log('Error Second Try Catch: ', err);
          handlePublicationError(err, 'freeMarket', () => publishInFreeMarket(publications, res, page, browser), browser);
        }
      });
  } catch (err: any) {
    console.log('Error First Try Catch: ', err);
    handlePublicationError(err, 'freeMarket', () => publishInFreeMarket(publications, res, page, browser), browser);
  }
};
