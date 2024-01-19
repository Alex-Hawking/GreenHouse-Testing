import { type Page } from '@PickleDecs'

const Open = async (page:Page, url: string) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
}

export default Open