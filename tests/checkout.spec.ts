import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { YourCartPage } from '../pages/shoping_cart/your_cart.page';
import { CheckoutPage } from '../pages/shoping_cart/checkout.page';

test.describe.only('checkout & Ordering', () => {
    let loginPage: LoginPage;
    let home: HomePage;
    let cart: YourCartPage;
    let checkout: CheckoutPage;

    test.beforeEach(async ({ page }, testInfo) => {
        loginPage = new LoginPage(page);
        if (testInfo.title.includes('without authorization')) {
            cart = new YourCartPage(page);
            checkout = new CheckoutPage(page);
        } else {
            await loginPage.open();
            // Log in to the application 
            home = await loginPage.login('standard_user', 'secret_sauce');
        }
    });

    test('Checkout without authorization', async ({ page }) => {
        await cart.open();
        let errorMsg = await loginPage.getErrorMessage();
        expect (errorMsg).toContain(`Epic sadface: You can only access '${cart.endpoint}' when you are logged in`);

        await checkout.open();
        errorMsg = await loginPage.getErrorMessage();
        expect (errorMsg).toContain(`Epic sadface: You can only access '${checkout.endpoint}' when you are logged in`);
    });


    test('Complete checkout without ZIP/Postal Code', async ({ page }) => {
        await home.addToCartProduct(0);
        await home.clickCartIcon();
        cart = new YourCartPage(page);
        expect(await cart.hasItems()).toBeTruthy();
        checkout = await cart.clickCheckoutBtn();
        await checkout.fillForm('John', 'Doe', '');
        await checkout.clickContinue();
        const errorMsg = await checkout.getErrorMessage();
        expect(errorMsg).toContain('Error: Postal Code is required');
    });


    test('Complete order', async ({ page }) => {
        await home.addToCartProduct(0);
        await home.clickCartIcon();
        cart = new YourCartPage(page);
        expect(await cart.hasItems()).toBeTruthy();

        checkout = await cart.clickCheckoutBtn();
        await checkout.fillForm('John', 'Doe', '7549');

        const checkout_overview = await checkout.continueToOverview();
        const title = await checkout_overview.getTitle();
        expect(title).toBe('Checkout: Overview');
        expect(await checkout_overview.isItemExists()).toBeTruthy();
        expect(await checkout_overview.isTotalPriceAccurate).toBeTruthy();
        
        const checkout_complete = await checkout_overview.clickFinish();
        expect(await checkout_complete.getTitle()).toBe('Checkout: Complete!');
        expect(await checkout_complete.getSuccessMessage()).toBe('Thank you for your order!');
    });


    test.only('Try to complete order with empty basket', async ({ page }) => {
        await home.clickCartIcon();
        cart = new YourCartPage(page);
        expect(await cart.hasItems()).not.toBeTruthy();

        checkout = await cart.clickCheckoutBtn();
        await checkout.fillForm('John', 'Doe', '7549');

        const checkout_overview = await checkout.continueToOverview();
        const title = await checkout_overview.getTitle();
        expect(title).toBe('Checkout: Overview');
        
        const checkout_complete = await checkout_overview.clickFinish();
        expect(await checkout_complete.getTitle()).not.toBe('Checkout: Complete!');
        expect(await checkout_complete.getSuccessMessage()).not.toBe('Thank you for your order!');
    });
})