import Step from '@Step/Template'
import { Given, And } from '@Step/Keywords'
import { type Page } from '@PickleDecs'
import { Set } from '@Actions'

const SaveRandomStr = new Step(
    //Matching gherkin
    [
        Given('I generate random string with length {int} and save as {string}'),
        And('I generate random string with length {int} and save as {string}')
    ],
    
    //Handler function
    async (page: Page, length: string, variable: string) => {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      let len = parseInt(length)
      for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
      }
      Set(page, variable, result)
    }
)

export default SaveRandomStr