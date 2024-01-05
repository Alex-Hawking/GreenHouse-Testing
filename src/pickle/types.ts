import {type Page } from 'playwright/test';

export type StepRegex = () => RegExp;
export type HandlerFunction = (match: any, page: Page) => Promise<void>;