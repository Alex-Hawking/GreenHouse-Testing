import Step from '@Step/Template'
import { Given } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import { Open } from '@Actions'

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