import Step from '@Step/Template'
import { Given, And, When } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const ClickElement = new Step(
    //Matching gherkin
    [
        Given('I double-click {string}'),
        And('I double-click {string}'),
        When('I double-click {string}'),
        When('I double-click the button {string}')
    ],
    
    //Handler function
    async (page: Page, selector: string) => {
        await page.dblclick(selector, {
            button: 'left', 
            delay: 100, 
          });
    }
)

export default ClickElement