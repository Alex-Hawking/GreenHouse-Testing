import { type Page } from '@PickleDecs';

const Type = async (page: Page, selector: string, text: string) => {
    const element = await page.$(selector);
    const tagName = await element.evaluate((node: { tagName: string; }) => node.tagName.toLowerCase());
    const isInputOrTextarea = tagName === 'input' || tagName === 'textarea';

    // Focus on the element
    await page.click(selector);

    if (isInputOrTextarea) {
        // Clear the input or textarea before typing
        await element.fill('');
        // Type the new text
        await element.type(text);
    } else {
        // For non-input/textarea elements, ensure it's clear (if necessary) and then type
        // This might involve custom logic depending on the element
        await page.waitForTimeout(100); // Adjust as necessary
        await page.keyboard.type(text);
    }
}

export default Type;
