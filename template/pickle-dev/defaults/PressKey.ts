import Step from '@Step/Template'
import { And, When } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const Log = new Step(
    //Matching gherkin
    [
        And('I press the key {string}'),
        And('I press {string}'),
        When('I press the key {string}')
    ],
    
    //Handler function
    async (page: Page, key: string) => {
        await page.keyboard.press(key)
    }
)

export default Log