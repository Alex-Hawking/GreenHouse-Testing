import { Page } from 'playwright/test'

const Click = async (page:Page, selector: string) => {
    await page.locator(selector).click({
        force: true
    })
}

export default Click