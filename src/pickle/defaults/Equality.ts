import Step from '@Step/Template'
import { Then } from '@Step/Keywords'
import { type Page } from 'playwright/test'

const Equality = new Step(
    //Matching gherkin
    [
        Then('{string} should equal {string}')
    ],
    
    //Handler function
    async (page: Page, var1: string, var2: string) => {
      if (var1 != var2) {
        throw new Error(`${var1} does not equal ${var2}`)
      }
    }
)

export default Equality