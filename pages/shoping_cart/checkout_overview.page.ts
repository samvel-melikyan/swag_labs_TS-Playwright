import { Page, Locator } from '@playwright/test';
import { CheckoutCompletePage } from './checkout_complete.page';
import { HomePage } from '../home.page';
import { BasePage } from '../base.page';

export class CheckoutOverviewPage extends BasePage {
    readonly page: Page;
    readonly title: Locator;
    readonly cancelBtn: Locator;
    readonly finishBtn: Locator;
    readonly itemTotalPrice: Locator;
    readonly taxTotalPrice: Locator;
    readonly totalPrice: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly endpoint: string = '/checkout-step-two.html';

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.title = page.locator('.title');
        this.cancelBtn = page.locator('[name="cancel"]');
        this.finishBtn = page.locator('#finish');
        this.itemTotalPrice = page.locator('.summary_subtotal_label');
        this.taxTotalPrice = page.locator('.summary_tax_label');
        this.totalPrice = page.locator('.summary_info_label.summary_total_label');
        this.itemNames = page.locator('.inventory_item_name');
        this.itemPrices = page.locator('.inventory_item_price');
    }


    async clickFinish(): Promise<CheckoutCompletePage> {
        await this.finishBtn.click();
        return new CheckoutCompletePage(this.page);
    }

    async clickItem(index: number) {
        await this.itemNames.nth(index).click();
    }

    async getTitle(): Promise<string> {
        return await this.title.textContent() || '';
    }

    async clickCancel(): Promise<HomePage> {
        await this.cancelBtn.click();
        return new HomePage(this.page);
    }

    async isItemExists(): Promise<boolean> {
        return (await this.itemNames.count()) > 0;
    }

    async isItemTotalAccurate(): Promise<boolean> {
        const count = await this.itemPrices.count();
        let sum = 0;
        for (let i = 0; i < count; i++) {
            const priceText = await this.itemPrices.nth(i).textContent();
            const price = parseFloat(priceText?.replace('$', '') || '0');
            sum += price;
        }

        const itemTotal = parseFloat((await this.itemTotalPrice.textContent())?.replace('Item total: $', '') || '0');
        return sum === itemTotal;
    }

    async isTotalPriceAccurate(): Promise<boolean> {
        const itemTotal = parseFloat((await this.itemTotalPrice.textContent())?.replace('Item total: $', '') || '0');
        const tax = parseFloat((await this.taxTotalPrice.textContent())?.replace('Tax: $', '') || '0');
        const total = parseFloat((await this.totalPrice.textContent())?.replace('Total: $', '') || '0');
        return (itemTotal + tax) === total;
    }

    async getItemTotal(): Promise<number> {
        return parseFloat((await this.itemTotalPrice.textContent())?.replace('Item total: $', '') || '0');
    }

    async getTaxTotal(): Promise<number> {
        return parseFloat((await this.taxTotalPrice.textContent())?.replace('Tax: $', '') || '0');
    }

    async getTotal(): Promise<number> {
        return parseFloat((await this.totalPrice.textContent())?.replace('Total: $', '') || '0');
    }

    
}
