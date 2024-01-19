import { type Page } from '@PickleDecs'

const Click = async (page:Page, selector: string) => {
    await page.click(selector, {
        force: true
    })
}

export default Click