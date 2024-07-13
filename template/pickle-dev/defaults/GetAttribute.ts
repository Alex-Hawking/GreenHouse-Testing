import Step from '@Step/Template'
import { Then } from '@Step/Keywords'
import { type Page } from '@PickleDecs'

const Equality = new Step(
    //Matching gherkin
    [
        Then('the element {string} attribute {string} is {string}')
    ],
    
    //Handler function
    async (page: Page, selector, attribute, value) => {
        let attVal = await page.getAttribute(selector, attribute).then((val: any) => {
          return val
        })
      
        //use-case 01 : validate state of pagination arrows on first page load when there are multiple pages of data
      
        //on load pagination back arrow has disabled attribute, this is disabled = true
        //returns type of string
        //value of string is empty (not null)
        if (typeof attVal === 'string' && attVal.length === 0) {
          attVal = 'true'
        }
      
        //on load pagination forward arrow does not have the disabled attribute, this is disabled = false
        //returns type of object
        //value of object is null (this is because 'disabled' attribute doesn't have a value assigned - if attribute had value assigned the value would be returned)
        if (typeof attVal === 'object' && attVal === null) {
          attVal = 'false'
        }
      
        expect(attVal.toString()).toEqual(value)
      }
      
)

export default Equality