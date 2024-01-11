import {type Page } from 'playwright/test';

export type StepRegex = () => RegExp;
export type HandlerFunction = (...args: [...any[], page: Page]) => Promise<void>;