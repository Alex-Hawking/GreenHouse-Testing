import { Page } from 'playwright/test'

const Type = async (page:Page, selector: string, text: string) => {
    await page.click(selector); 
    await page.waitForTimeout(100);
    await page.keyboard.type(text);
}

export default Type