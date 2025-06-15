import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { CheckoutOverviewPage } from './checkout_overview.page';

export class CheckoutPage extends BasePage {
    readonly page: Page;
    readonly title: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly cancelBtn: Locator;
    readonly continueBtn: Locator;
    readonly errorText: Locator;
    readonly errorBtn: Locator;
    readonly endpoint: string = '/checkout-step-one.html';

    private defaultFirstName = 'Piter';
    private defaultLastName = 'Peterson';
    private defaultPostalCode = '30103';

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.title = page.locator('.title');
        this.firstName = page.locator('#first-name');
        this.lastName = page.locator('#last-name');
        this.postalCode = page.locator('#postal-code');
        this.cancelBtn = page.locator('[name="cancel"]');
        this.continueBtn = page.locator('#continue');
        this.errorText = page.locator('.error-message-container.error');
        this.errorBtn = page.locator('.error-button');
    }

    async fillFirstName(name: string) {
        await this.firstName.fill(name);
    }

    async fillLastName(name: string) {
        await this.lastName.fill(name);
    }

    async fillPostalCode(code: string) {
        await this.postalCode.fill(code);
    }

    async fillForm(first = this.defaultFirstName, last = this.defaultLastName, code = this.defaultPostalCode) {
        await this.fillFirstName(first);
        await this.fillLastName(last);
        await this.fillPostalCode(code);
    }

    async continueToOverview(): Promise<CheckoutOverviewPage> {
        await this.continueBtn.click();
        return new CheckoutOverviewPage(this.page);
    }

    async clickContinue(): Promise<void> {
        await this.continueBtn.click();
    }

    async clickCancel(): Promise<void> {
        await this.cancelBtn.click();
    }

    async getTitleText(): Promise<string> {
        return await this.title.textContent() || '';
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorText.textContent() || '';
    }

    async closeErrorMessage() {
        await this.errorBtn.click();
    }

    async isErrorVisible(): Promise<boolean> {
        return await this.errorBtn.isVisible();
    }
}
