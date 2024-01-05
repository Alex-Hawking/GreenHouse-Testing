# GreenHouse 🌱

Currently in *pre-alpha*, everything is subject to change and become (*hopefully*) better! 

## What is this?

This is an application for browser-based front-end QA testing. 
GreenHouse offers the abilitiy to **compile** Gherkin code into Playwright/Jest **test files** (`test.js`), which can then be run from anywhere using Jest.

> Gherkin is a domain-specific language that enables the definition of business behavior without the need to go into the details of implementation. It's primarily used for Behavior-Driven Development (BDD), a software development approach that encourages collaboration between developers, QA, non-technical participants, and business stakeholders. (Thanks ChatGPT) [more](https://cucumber.io/docs/gherkin/reference/)

## How does it work? (Docs)

There are 2 main parts to GreenHouse.

### Writing Tests

Tests are broken into 2 parts *features* and *steps*. <br>

**Features** <br>

Features are Gherkin script like below:
```
Feature: Example test

    Scenario:
        Given I say 'Hello World!'
```

Tests are saved as `.feature` files within the `/features/` directory of your `BDD` directory (more on this later).

Tests MUST have `Feature: (basic explainer of test)`  <br>

**Steps** <br>

Steps are the typescript code definitions for each action within the Gherkin script. See the below example:
```typescript
import Step from '@Steps/Template'
import { And } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const sayHello = new Step(
    //Matching gherkin
    [
        Given('I say hello')
    ],
    
    //Handler function
    async (page: Page) => {
        console.log("Hello World!")
    }
)

export default sayHello
```
The Step class constructor requires 2 arguments:
- *Sentences to match*, created using the pre-defined keywords
- *A handler function*, essentially saying what to do (all handler functions require the Playwright page object as an argument to allow the tests to interact with the browser page)

Currently the following matching keywords can be used:
```
Given()

Then()

When()

And()
```
Handler functions can also accept variables from the Gherkin sentence, see below:
```typescript
import Step from '@Steps/Template'
import { Given } from '@Steps/Keywords'
import { Page } from 'playwright/test'

const test = new Step(
    //Matching gherkin
    [
        Given('I open {string}')
    ],
    
    //Handler function
    async (url: string, page: Page) => {
        await page.goto(url, { waitUntil: 'load' })
    }
)

export default test
```
The datatype to pass into the function is given between `{}`. Currently the following datatypes are accepted:
```
{string}: any characters between 2 quotes ""    
{bool}: true / false  
{int}: any numbers (I will probably adding floating point numbers soon)         
```
Currently variables are passed in as arguments in the order they appear in the sentence. *Always leave page as the last argument*.

All typescript step definitions must be kept within the steps folder. See the below tree:
```
Example_BDD_Folder
├── features
│   └── example.feature
├── picklereqs.d.ts
└── steps
    ├── hello.ts
    ├── open.ts
```
**Note:** The file `picklereqs.d.ts` is also in the BDD folder, this simply contains module declarations `declare module '@Steps/Template' declare module '@Steps/Keywords'` and is optional, I just have it to silence text-editor warnings.

### Running Tests

*To run tests you currently must be within the greenhouse directory, also make sure you install all the modules*

First build all the typescript: `npm run build`
Then compile your Gherkin code into jest tests: `npm run compile <path-to-your-BDD-folder>`
Then run your tests: `npm run tests`

Optionally you can also run: `npm run reset <path-to-your-BDD-folder>` which basically just builds and compiles everything.

Also there a number of options that can be configured in `GreenHouse.js`, including things like headless mode and logging options.

## What's next?

Adding a bunch of default step definitions for basic tasks, as well as cleaning code and improving performance.

TODO:

- [ ] save to variables
- [ ] use variables for selectors
- [ ] cleanup compilation
- [ ] config json
- [ ] default definitions
- [ ] wiki
- [ ] save logs