import Step from '@Step/Template'
import { Then } from '@Step/Keywords'
import { type Page } from 'playwright/test'

const Log = new Step(
    //Matching gherkin
    [
        Then('I log {string} to the console')
    ],
    
    //Handler function
    async (page: Page, val: string) => {
      console.log(val)
    }
)

export default Log