import Step from '@Step/Template'
import { And, When } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import { Type }  from '@Actions'

const ClickElement = new Step(
    //Matching gherkin
    [
        And('I set the text {string} to the element {string}'),
        When('I set the text {string} to the element {string}'),
        When('I type {string} into {string}')
    ],
    
    //Handler function
    async (page: Page, text: string, selector: string) => {
        await Type(page, selector, text)
    }
)

export default ClickElement