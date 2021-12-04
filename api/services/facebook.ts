import puppeteer from 'puppeteer';
import urls from '../utils/urls';
import { facebookLogin } from '../actions/login';
import downloadFile from '../utils/download-file';
import { IFBMarketPlacePublication } from '../models/common';
import { overridePermissions } from '../actions/permissions';

export const publishInMarketplace = (publication: IFBMarketPlacePublication) => {
  puppeteer.launch({
    headless: false, // put false to see how the bot work
  }).then((browser) => {
    browser.newPage().then(async (page) => {
      overridePermissions(browser, urls.facebookURL);
      await page.goto(`${urls.facebookURL}login`);
      await facebookLogin(page);
      page.goto(urls.facebookMarketPlace);
      await page.waitForTimeout(3000);

      const inputRefs = {
        title: 'label[aria-label="Título"] input',
        price: 'label[aria-label="Precio"] input',
        description: 'textarea:nth-child(1)',
        tags: 'textarea:nth-child(2)',
        categorySelect: 'label[aria-label="Categoría"]',
        state: 'label[aria-label="Estado"]',
        electronicCategory: '.jxo0map8:nth-child(16)',
        stateNew: '.oajrlxb2 .qzhwtbm6.knvmm38d:nth-child(2)',
        inputFIle: '.mkhogb32[type="file"][multiple]',
        publishButton: '[aria-label="Publicar"]',
        nextButton: '[aria-label="Siguiente"]',
      };
      // titulo
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
          await page.click(inputRefs.categorySelect);

          // selecting electronic product category
          await page.evaluate(() => {
            (document.querySelectorAll('.jxo0map8')[15] as any).click();
          });

          await page.click(inputRefs.state);
          await page.waitForTimeout(2000);
          // selecting Nuevo state
          await page.evaluate((path = 'path') => {
            console.log(path);
            (document.querySelectorAll('.oajrlxb2 .qzhwtbm6.knvmm38d')[2] as any).click();
          });
          await page.click(inputRefs.nextButton);
          await page.waitForTimeout(1000);

          // selecting all groups to publish the product
          await page.evaluate(() => {
            Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item: any) => item.click());
          });

          // publishing the article
          await page.click(inputRefs.publishButton);
        });
    });
  });
};
