import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ProductPage } from './product.page';

export class HomePage extends BasePage {
    readonly title: Locator;
    readonly products: Locator;
    readonly addToCartBtns: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly filterDropdown: Locator;
    readonly endpoint: string = '/inventory.html';

    constructor(page: Page) {
        super(page);
        this.title = page.locator('.title');
        this.products = page.locator('.inventory_item');
        this.addToCartBtns = page.locator('.btn_inventory');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.filterDropdown = page.locator('.product_sort_container');
    }



    async getTitle(): Promise<string> {
        return (await this.title.textContent()) ?? '';
    }

    async randomProductNumber(): Promise<number> {
        const productCount = await this.products.count();
        return Math.floor(Math.random() * productCount);
    }

    async addToCartProduct(index?: number) {
        const productIndex = index ?? await this.randomProductNumber();
        await this.addToCartBtns.nth(productIndex).click();
    }

    async getProductName(index: number): Promise<string> {
        return (await this.productNames.nth(index).textContent()) ?? '';
    }

    async getProductPrice(index: number): Promise<string> {
        return (await this.productPrices.nth(index).textContent()) ?? '';
    }

    async isProductsSorted(by: String): Promise<boolean> {
        if (by === 'az') {
            const names = await this.productNames.allTextContents();
            return JSON.stringify(names) === JSON.stringify([...names].sort());
        } else if (by === 'za') {
            const names = await this.productNames.allTextContents();
            return JSON.stringify(names) === JSON.stringify([...names].sort().reverse());
        } else if (by === 'lohi') {
            const prices = await this.productPrices.allTextContents();
            const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
            return JSON.stringify(numericPrices) === JSON.stringify([...numericPrices].sort((a, b) => a - b));
        } else if (by === 'hilo') {
            const prices = await this.productPrices.allTextContents();
            const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
            return JSON.stringify(numericPrices) === JSON.stringify([...numericPrices].sort((a, b) => b - a));
        } else
            return false;
    }

    async selectFilterOption(value: string) {
        await this.filterDropdown.selectOption({ value: value });
    }

    async goToProduct(index: number): Promise<ProductPage> {
        await this.productNames.nth(index).click();
        return new ProductPage(this.page);
    }
}
