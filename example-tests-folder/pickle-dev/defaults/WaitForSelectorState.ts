import Step from '@Step/Template'
import { And, Then } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const states = ['attached', 'detached', 'visible', 'hidden']

const WaitForSelectorState = new Step(
    //Matching gherkin
    [
        Then('I wait for element {string} to be {string}'),
        And('I wait for element {string} to be {string')
    ],
    
    //Handler function
    async (page: Page, element: string, state: any) => {
        if (!states.includes(state)) {
            throw new Error('Invalid selector state: ' + state)
        }

        await page.locator(element).waitFor({
            state: state,
        })
    }
)

export default WaitForSelectorState