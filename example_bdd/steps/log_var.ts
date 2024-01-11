import Step from '@Steps/Template'
import { Then } from '@Steps/Keywords'
import { Page } from 'playwright/test'
import { Get } from '@Actions/VarControl'

const test = new Step(
    //Matching gherkin
    [
        Then('I log {string}')
    ],
    
    //Handler function
    async (varName: string, page: Page) => {
        console.log(Get(page, varName))
    }
)

export default test