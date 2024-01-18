import { Page } from 'playwright/test'

const Click = async (page:Page, selector: string) => {
    await page.click(selector, {
        force: true
    })
}

export default Click