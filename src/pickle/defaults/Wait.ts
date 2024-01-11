import Step from '@Step/Template'
import Wait from '@Actions/Wait'
import { Then } from '@Step/Keywords'
import { type Page } from 'playwright/test'

const WaitTimeout = new Step(
    //Matching gherkin
    [
        Then('I wait {int}s')
    ],
    
    //Handler function
    async (page: Page, time: string) => {
        await Wait(page, time)
    }
)

export default WaitTimeout