import Step from '@Step/Template'
import { Given, And } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import Click from '@Actions/Click'

const ClickElement = new Step(
    //Matching gherkin
    [
        Given('I click {string}'),
        And('I click {string}')
    ],
    
    //Handler function
    async (page: Page, selector: string) => {
        await Click(page, selector)
    }
)

export default ClickElement