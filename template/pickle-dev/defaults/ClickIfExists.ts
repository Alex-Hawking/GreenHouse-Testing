
import Step from '@Step/Template'
import { Then } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const ClickElement = new Step(
    //Matching gherkin
    [
        Then(`I click {string} if it exists`)
    ],
    
    //Handler function
    async (page: Page, selector: string) => {
        await page.locator(selector)
        .click({
            delay: 0,
            force: true,
            timeout: 1000,
            noWaitAfter: true,
        })
        .catch((err: Error) => {
            if(err.message.includes(`locator.click:`)) return true
            
            throw err
        })
    }
)

export default ClickElement
