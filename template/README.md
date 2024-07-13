# GreenHouse 🌱 `Template Test Dir`

Currently in *pre-alpha*, everything is subject to change and become (*hopefully*) better! 

## What is this?

This is the template for the folder where tests are stored within GreenHouse.

For the tests to compile correctly please maintain this structure:
```
TestsFolder
├── GreenHouse.js
├── PickleDecs.ts
├── alias.ts
├── bdd
│   ├── features
│   └── steps
├── pickle-dev
│   ├─ (default steps, actions and templates are stored here)
└── tsconfig.json
```

## Usage

- Add your Gherkin `.feature` files into the `bdd/features` folder
- Add your custom step definitions `.ts` into the `bdd/steps` folder
- Configure `GreenHouse.js` to your liking

DO NOT change anything within the `/pickle-dev/` directory.

## What do I do with this?

- Compile the tests into Jest-Tests using the [GreenHouse compiler](https://github.com/GreenHouseTesting/GreenHouse-Core)
- Write your tests locally using the [local testing environment](https://github.com/GreenHouseTesting/GreenHouse-Local-Testing)
- Run the tests using the GitHub action (in development)