import Step from '@Step/Template'
import { Wait } from '@Actions'
import { Then, And } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const WaitTimeout = new Step(
    //Matching gherkin
    [
        Then('I wait {int}s'),
        And('I wait {int}s'),
        And('I wait for {int} seconds'),
        And('I wait {int} seconds')
    ],
    
    //Handler function
    async (page: Page, time: string) => {
        await Wait(page, time)
    }
)

export default WaitTimeout