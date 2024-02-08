# GreenHouse 🌱

Currently in *pre-alpha*, everything is subject to change and become (*hopefully*) better! 

## What is this?

This is an application for browser-based front-end QA testing. 
GreenHouse offers the abilitiy to **compile** Gherkin code into Playwright/Jest **test files** (`test.js`), which can then be run from anywhere using Playwright/Jest.

I am also building a docker image that is used for running these for local testing (in browser) and in a GitHub action (headless)

> Gherkin is a domain-specific language that enables the definition of business behavior without the need to go into the details of implementation. It's primarily used for Behavior-Driven Development (BDD), a software development approach that encourages collaboration between developers, QA, non-technical participants, and business stakeholders. (Thanks ChatGPT) [more](https://cucumber.io/docs/gherkin/reference/)

## Documentation

See the main page for a step by step interpretation of the Wiki. Or see the Wiki tab to see docs specific to this repository.

## What's next?

Adding a bunch of default step definitions for basic tasks, as well as cleaning code and improving performance.

TODO:

- [x] save to variables
- [x] use variables for selectors (in progress)
- [x] default definitions (in progress)
- [x] functions for repeated actions (in progress)
- [x] cleanup compilation
- [x] config js
- [ ] wiki
- [ ] save logs (in progress)
- [ ] format saved logs (in progress)
- [ ] caching of compiled files
- [x] user friendly error catching with compilation and running
- [ ] implement cucumbers `Background` feature
- [ ] better error handling