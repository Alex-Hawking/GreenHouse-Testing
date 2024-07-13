import Step from '@Step/Template'
import { Given, And, When } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import { Click}  from '@Actions'

const ClickElement = new Step(
    //Matching gherkin
    [
        Given('I click {string}'),
        And('I click {string}'),
        When('I click {string}'),
        When('I click the button {string}')
    ],
    
    //Handler function
    async (page: Page, selector: string) => {
        await Click(page, selector)
    }
)

export default ClickElement