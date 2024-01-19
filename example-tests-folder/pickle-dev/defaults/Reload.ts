import Step from '@Step/Template'
import { Then } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const states = ['attached', 'detached', 'visible', 'hidden']

const Reload = new Step(
    //Matching gherkin
    [
        Then('I reload the page')
    ],
    
    //Handler function
    async (page: Page, element: string, state: any) => {
        await page.reload()
    }
)

export default Reload