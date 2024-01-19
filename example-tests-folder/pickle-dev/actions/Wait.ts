import { Page } from '@PickleDecs'

const Wait = async (page:Page, time: string) => {
    await page.waitForTimeout(parseInt(time) * 1000)
    
}

export default Wait