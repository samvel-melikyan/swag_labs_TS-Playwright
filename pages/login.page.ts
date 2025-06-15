import { Page, Locator } from '@playwright/test';
import { HomePage } from './home.page';

export class LoginPage {
    private page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;
    readonly errorMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('input[name="user-name"]');
        this.password = page.locator('input[name="password"]');
        this.loginBtn = page.locator('#login-button');
        this.errorMsg = page.locator('.error-message-container.error');
    }

    async open() {
        await this.page.goto('/');
    }

    async login(username: string, password: string): Promise<HomePage> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
        return new HomePage(this.page);
    }

    async getErrorMessage(): Promise<string> {
        return (await this.errorMsg.textContent()) ?? '';
    }
}
