import { Page } from 'puppeteer';
import { IDomRefObjectKeys, refObjFromKeys } from '../utils/DOMRefs';

export type IMultipleInputValues = {
  [N in string]?: string;
}

/* fillInput, fill an input */
export const fillInput = async (page: Page, inputRef: string, value: string) => {
  await page.type(inputRef, value);
};

/* fillMultipleInputs, fill multiple inputs according to the inputs values given
* @param page: Page
* @param inputValues: an object with the values to fill some form input
* @param refObjType: marketplace ref to the object with the references of the dom to each input
*  */
export const fillMultipleInputs = async (page: Page, inputValues: IMultipleInputValues, refObjType: IDomRefObjectKeys) => {
  // object with all references to the dom for the marketplace selected
  const domRefObj = refObjFromKeys[refObjType];
  await Promise.all(Object.keys(inputValues).map((inputKey) => {
    return page.type(domRefObj[inputKey], '100' || '');
  }));
};
