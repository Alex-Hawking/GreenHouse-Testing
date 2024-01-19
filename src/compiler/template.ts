export const template = (globalPath: string) => { 
  const globals = require(globalPath)
  return `// This file was compiled from Gherkin using GreenHouse🌱 (https://github.com/Alex-Hawking/GreenHouse/tree/main)
#comment

#imports
const { chromium } = require('playwright');
describe('#name', () => {
  let browser, context, page;
  beforeAll(async () => {
    try {
      browser = await chromium.launch({ headless: false });
      context = await browser.newContext({
        recordVideo: {
          dir: '/app/tests/videos'
        }
      });
      page = await context.newPage();
      page.variables = new Map();
    } catch (error) {
      console.error('Error setting up the browser:', error);
      throw error;
    }
  });
  afterAll(async () => {
    try {
      if (page) await page.close();
      if (context) await context.close(); 
      if (browser) await browser.close();
    } catch (error) {
      console.error('Error closing the browser:', error);
    }
  });
  const runStep = async (stepFunction, ...args) => {
    try {
      await stepFunction(...args);
    } catch (error) {
      console.error('Error running step:', error);
      throw error;
    }
  };
  // Tests
#tests
});
`
}
