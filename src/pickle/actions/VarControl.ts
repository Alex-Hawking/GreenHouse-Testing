import { Page } from 'playwright/test';

declare module 'playwright/test' {
  interface Page {
    variables: Record<string, any>;
  }
}

export const Set = (page: Page, varName: string, value: string) => {
    page.variables.set(varName, value)
}

export const Get = (page: Page, varName: string) => {
    return page.variables.get(varName)
}