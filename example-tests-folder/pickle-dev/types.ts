import type { Page } from '@PickleDecs'

export type StepRegex = () => RegExp;
export type HandlerFunction = (page: Page, ...args: any[]) => Promise<void>;