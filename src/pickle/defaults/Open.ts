import Step from '@Step/Template'
import { Given } from '@Step/Keywords'
import { type Page } from 'playwright/test'
import Open from '@Actions/Open'

const OpenUrl = new Step(
    //Matching gherkin
    [
        Given('I open {string}')
    ],
    
    //Handler function
    async (page: Page, url: string) => {
        await Open(page, url)
    }
)

export default OpenUrl