import Step from '@Steps/Template'
import { Then, And } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        And('I add {int} to variable {string}'),
    ],
    
    //Handler function
    async (number: number, number2: number, page: Page) => {
        await console.log(number + number2)
    }
)

export default test