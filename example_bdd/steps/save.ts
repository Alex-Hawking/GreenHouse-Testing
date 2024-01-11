import Step from '@Steps/Template'
import { Given, Then } from '@Steps/Keywords'
import { Page } from 'playwright/test'
import { Set } from '@Actions/VarControl'

const test = new Step(
    //Matching gherkin
    [
        Given('I save {string} as {string}'),
        Then('I save {string} as {string}')
    ],
    
    //Handler function
    async (content, varName, page: Page) => {
        Set(page, varName, content)
    }
)

export default test