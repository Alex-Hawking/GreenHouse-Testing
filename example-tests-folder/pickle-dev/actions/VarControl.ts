import { Page } from '@PickleDecs';

export const Set = (page: Page, varName: string, value: string) => {
    page.variables.set(varName, value)
}

export const Get = (page: Page, varName: string) => {
    return page.variables.get(varName)
}