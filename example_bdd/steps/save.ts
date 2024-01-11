import Step from '@Steps/Template'
import { Given } from '@Steps/Keywords'
import { Page } from 'playwright/test'
import { Set } from '@Actions/VarControl'

const Save = new Step(
    //Matching gherkin
    [
        Given('I save {string} as {string}'),
    ],
    
    //Handler function
    async (content, varName, page: Page) => {
        Set(page, varName, content)
    }
)

export default Save