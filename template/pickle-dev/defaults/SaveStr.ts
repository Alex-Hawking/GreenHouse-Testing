import Step from '@Step/Template'
import { Given, And } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import { Set } from '@Actions'

const SaveStr = new Step(
    //Matching gherkin
    [
        Given('I save {string} as {string}'),
        And('I save {string} as {string}')
    ],
    
    //Handler function
    async (page: Page, str: string, variable: string) => {
      Set(page, variable, str)
    }
)

export default SaveStr