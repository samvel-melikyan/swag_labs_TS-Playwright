import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;
    readonly cartIcon: Locator;
    readonly menuBtn: Locator;
    readonly endpoint: string = '/';

    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.locator('.shopping_cart_link');
        this.menuBtn = page.locator('#react-burger-menu-btn');
    }

    async open() {
        await this.page.goto(this.endpoint);
    }

    async openMenu() {
        await this.menuBtn.click();
    }

    async clickCartIcon() {
        await this.cartIcon.click();
    }

    async isCartIconVisible(): Promise<boolean> {
        return this.cartIcon.isVisible();
    }

    async copyPaste(from: Locator, to: Locator) {
        const text = await from.inputValue();
        await to.fill(text);
    }
}
