import Step from '@Step/Template'
import { Given, And } from '@Step/Keywords'
import { type Page } from 'playwright/test'
import { Set, Get } from '@Actions/VarControl'

const SaveRandomStr = new Step(
    //Matching gherkin
    [
        Given('I save generate a random string with length {int} and save as {string}'),
        And('I save generate a random string with length {int} and save as {string}')
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