import Step from '@Steps/Template'
import { And } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        And('I say hello')
    ],
    
    //Handler function
    async (url: string, page: Page) => {
        console.log("Hello World!")
    }
)

export default test