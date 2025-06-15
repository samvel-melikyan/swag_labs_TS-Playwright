import { Page, Locator } from '@playwright/test';
import { CheckoutPage } from './checkout.page';
import { BasePage } from '../base.page';

export class YourCartPage extends BasePage {
    readonly page: Page;
    readonly continueShopping: Locator;
    readonly checkoutBtn: Locator;
    readonly removeBtns: Locator;
    readonly title: Locator;
    readonly items: Locator;
    readonly nameList: Locator;
    readonly endpoint: string = '/cart.html';

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.continueShopping = page.locator('[name="continue-shopping"]');
        this.checkoutBtn = page.locator('#checkout');
        this.removeBtns = page.locator('.btn.btn_secondary.btn_small.cart_button');
        this.title = page.locator('.title');
        this.items = page.locator('.cart_item');
        this.nameList = page.locator('.inventory_item_name');
    }


    async clickItem(index: number) {
        await this.nameList.nth(index).click();
    }

    async existsItemWithName(name: string): Promise<boolean> {
        const count = await this.nameList.count();
        for (let i = 0; i < count; i++) {
            if ((await this.nameList.nth(i).textContent()) === name) {
                return true;
            }
        }
        return false;
    }

    async hasItems(): Promise<boolean> {
        return (await this.items.count()) > 0;
    }

    async removeItem(index: number) {
        await this.removeBtns.nth(index).click();
    }

    async getItemNameByExact(name: string): Promise<string | null> {
        const count = await this.nameList.count();
        for (let i = 0; i < count; i++) {
            const text = await this.nameList.nth(i).textContent();
            if (text === name) return text;
        }
        return null;
    }

    async clickContinueShopping() {
        await this.continueShopping.click();
    }

    async clickCheckoutBtn(): Promise<CheckoutPage> {
        await this.checkoutBtn.click();
        return new CheckoutPage(this.page);
    }

    async getTitle(): Promise<string> {
        return await this.title.textContent() || '';
    }
}
