const globals = require('../../../GreenHouse')

export const template: string = `#comment

#imports

const { chromium } = require('playwright');

describe('#name', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch browser
    browser = await chromium.launch({ headless: ${globals.headless} });

    // Create a new page
    page = await browser.newPage();
  });

  afterAll(async () => {
    // Close the page
    await page.close();

    // Close the browser
    await browser.close();
  });

  #tests

});
`
