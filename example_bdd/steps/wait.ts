import Step from '@Steps/Template'
import { Then } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        Then('I wait {int}s')
    ],
    
    //Handler function
    async (time: string, page: Page) => {
        await page.waitForTimeout(parseInt(time))
    }
)

export default test