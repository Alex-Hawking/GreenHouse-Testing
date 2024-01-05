import Step from '@Steps/Template'
import { Given, Then } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        Given('I open {string}'),
        Then('I write {string} to console')
    ],
    
    //Handler function
    async (url: string, page: Page) => {
        await page.goto(url, { waitUntil: 'load' })
    }
)

export default test