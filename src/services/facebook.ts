import puppeteer from 'puppeteer';
import urls from '../utils/urls';
import downloadFile from '../utils/download-file';
import { IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';
import { facebookLogin } from '../actions/login';
import { refObjFromKeys } from '../utils/DOMRefs';

export const publishInMarketplace = async (publication: IFBMarketPlacePublication, res: any) => {
  puppeteer.launch({
    headless: true, // put false to see how the bot work
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  }).then((browser) => {
    browser.newPage().then(async (page) => {
      overridePermissions(browser, urls.facebookURL);

      await page.goto(`${urls.facebookURL}login`);
      await facebookLogin(page);
      page.goto(urls.facebookMarketPlace);
      await page.waitForTimeout(3000);

      // TESTING
      // await page.goto('https://www.facebook.com/marketplace/you/selling');
      // await page.waitForTimeout(3000);
      //

      // all dom refs for facebook
      const inputRefs = refObjFromKeys.fb;
      await page.waitForSelector(inputRefs.title);
      const inputFile = await page.$(inputRefs.inputFIle);

      await downloadFile(publication.image,
        async (filePath: string) => {
          // uploading photo to the form
          inputFile && await inputFile.uploadFile(filePath);
          await page.type(inputRefs.title, publication.title);
          await page.type(inputRefs.price, publication.price);
          await page.type(inputRefs.description, publication.description);
          await page.type(inputRefs.tags, publication.tags || '');
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

          await page.click(inputRefs.state);
          await page.waitForTimeout(2000);
          // selecting Nuevo state
          await page.evaluate(() => {
            (document.querySelectorAll('.oajrlxb2 .qzhwtbm6.knvmm38d')[1] as any).click();
          });

          await page.click(inputRefs.nextButton);
          await page.waitForTimeout(2000);

          // selecting all groups to publish the product
          await page.evaluate(() => {
            Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item: any) => item && item.click());
          });

          // publishing the article
          await page.click(inputRefs.publishButton);
          await page.waitForNetworkIdle();
          await page.waitForTimeout(3000);
          // await page.evaluate(() => (document.querySelectorAll('[aria-label="Más"]')[2] as any).click());
          // await page.waitForTimeout(2000);
          await page.click(inputRefs.publishedItemListImg);
          await page.waitForNetworkIdle();
          await page.waitForTimeout(1000);

          const publicationUrl: string = (await page.$eval(inputRefs.itemLink, (item: any) => item.href)) || '';
          console.log(publicationUrl, 'klk');

          // const publicationUrl: string = await page.evaluate(
          //   () => {
          //     const item: any = Array.from(
          //     document.querySelectorAll('.tojvnm2t .j83agx80 a.oajrlxb2'))
          //       .find((el: any) => {
          //         const id = el.href.split('/')[el.href.split('/').length - 2];
          //         return !!Number(id);
          //       });
          //     return item.href;
          //   },
          // );
          // extracting the publicationID from the publicationUrl.split('/')
          const publicationId = publicationUrl ? publicationUrl.split('/')[publicationUrl.split('/').length - 2] : 0;
          res.status(200).json({ url: publicationUrl, id: publicationId });
          browser.close();
        });
    }).catch((err) => {
      res.status(500).json({ err });
    });
  }).catch((err) => {
    res.status(500).json({ err });
  });
};
