import { Page, Locator } from '@playwright/test';
import { HomePage } from '../home.page';
import { BasePage } from '../base.page';

export class CheckoutCompletePage extends BasePage {
    readonly page: Page;
    readonly title: Locator;
    readonly backToProducts: Locator;
    readonly successMessage: Locator;
    readonly endpoint: string = '/checkout-complete.html';

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.title = page.locator('.title');
        this.backToProducts = page.locator('#back-to-products');
        this.successMessage = page.locator('.complete-header');
    }


    async getTitle(): Promise<string> {
        return await this.title.textContent() || '';
    }

    async getSuccessMessage(): Promise<string> {
        return await this.successMessage.textContent() || '';
    }

    async clickBackToProducts(): Promise<HomePage> {
        await this.backToProducts.click();
        return new HomePage(this.page);
    }
}
