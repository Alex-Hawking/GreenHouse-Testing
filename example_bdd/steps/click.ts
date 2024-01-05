import Step from '@Steps/Template'
import { Then, And } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        Then('I click {string}'),
        And('I click {string}')
    ],
    
    //Handler function
    async (element: string, page: Page) => {
        await page.click(element)
    }
)

export default test