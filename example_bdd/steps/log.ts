import Step from '@Steps/Template'
import { Then, And } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        Then('I log {string}'),
        And('I log {string}')
    ],
    
    //Handler function
    async (text: string, page: Page) => {
        console.log(text)
    }
)

export default test