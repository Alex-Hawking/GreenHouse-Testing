# GreenHouse 🌱

Currently in *pre-alpha*, everything is subject to change and become (*hopefully*) better! 

## What is this?

GreenHouse is an application for browser-based front-end QA testing. It compiles Gherkin code into Playwright/Jest test files (`test.js`), which can be run using Playwright/Jest.

A Docker image is also being developed for running tests locally (in-browser) and in a GitHub action (headless).

> Gherkin is a domain-specific language for defining business behavior without detailed implementation. It's used in Behavior-Driven Development (BDD). [Learn more](https://cucumber.io/docs/gherkin/reference/)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Alex-Hawking/GreenHouse-Testing.git
    cd GreenHouse-Testing
    ```
2. Install the packages:
    ```bash
    npm install
    ```
3. Build the project:
    ```bash
    sudo npm run build
    ```
This should build and add GreenHouse to your PATH (this is basically cheat/janky way to do this while I fix the project).

## Usage

- Create a new GreenHouse project:
    ```bash
    ghc create /path/
    ```

- Compile feature files:
    ```bash
    ghc compile /path/
    ```

See the Wiki for full GreenHouse documentation.