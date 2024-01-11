import { type Page } from 'playwright/test';

export type StepRegex = () => RegExp;
export type HandlerFunction = (page: Page, ...args: any[]) => Promise<void>;