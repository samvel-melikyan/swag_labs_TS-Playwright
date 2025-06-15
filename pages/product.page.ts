import { Page, Locator } from '@playwright/test';
import { HomePage } from './home.page';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly backToProductsBtn;
  readonly name;
  readonly description;
  readonly price;
  readonly addToCartBtn;
  readonly removeBtn;

  constructor(page: Page) {
    super(page);
    this.backToProductsBtn = page.locator('#back-to-products');
    this.name = page.locator('.inventory_details_name');
    this.description = page.locator('.inventory_details_desc');
    this.price = page.locator('.inventory_details_price');
    this.addToCartBtn = page.locator('[id^="add-to-cart"]');
    this.removeBtn = page.locator('[id^="remove"]');
  }

  async getName() {
    return this.name.textContent();
  }

  async getDescription() {
    return this.description.textContent();
  }

  async getPrice() {
    return this.price.textContent();
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async removeFromCart() {
    await this.removeBtn.click();
  }

  async backToProducts() {
    await this.backToProductsBtn.click();
    return new HomePage(this.page);
  }
}
