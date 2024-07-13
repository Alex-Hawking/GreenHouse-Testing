import Step from '@Step/Template'
import { Then, And } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const CompareText = new Step(
    //Matching gherkin
    [
        Then('{string} contains {string}'),
        And('{string} contains {string}')
    ],
    
    //Handler function
    async (page: Page, selector: string, val: string) => {
      const content = await page.textContent(selector)
      expect(content).toMatch(val)
    }
)

export default CompareText