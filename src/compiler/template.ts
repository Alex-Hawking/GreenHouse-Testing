export const template = (globalPath: string) => { 
  const globals = require(globalPath)
  const streamingTools: string = `beforeAll(async () => {
    try {
      browser = await chromium.launch({ headless: false, args:['--no-sandbox', '--disable-setuid-sandbox', '--display=:99']});
      context = await browser.newContext({});
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      page = await context.newPage();
      await page.setViewportSize({ width: 1280, height: 720 });
      page.variables = new Map();
    } catch (error) {
      console.error('Error setting up the browser:', error);
      throw error;
    }
  });
  `
  let beforeAll
  if (globals.developerMode) {
    beforeAll = streamingTools
  } else {
    beforeAll = `beforeAll(async () => {
      try {
        browser = await chromium.launch({ headless: true });
        context = await browser.newContext({});
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        page = await context.newPage();
        page.variables = new Map();
      } catch (error) {
        console.error('Error setting up the browser:', error);
        throw error;
      }
    });
    `
  }
  return `// This file was compiled from Gherkin using GreenHouse🌱 (https://github.com/Alex-Hawking/GreenHouse/tree/main)
#comment

#imports
const { chromium } = require('playwright');
describe('#name', () => {
  let browser, context, page;
  ${beforeAll}
  afterAll(async () => {
    try {
      if (page) await page.close();
      if (context) await context.close(); 
      if (browser) await browser.close();
    } catch (error) {
      console.error('Error closing the browser:', error);
    }
  });
  const runStep = async (stepName, stepFunction, ...args) => {
    try {
      await stepFunction(...args);
    } catch (error) {
      console.log('Error running: ' + stepName)
      console.error('Error:', error);
      throw error;
    }
  };
  // Tests
#tests
});
`
}
