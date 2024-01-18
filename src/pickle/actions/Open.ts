import { Page } from 'playwright/test'

const Open = async (page:Page, url: string) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
}

export default Open