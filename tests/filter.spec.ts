import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

test.describe('Filter Tests', () => {
    let loginPage: LoginPage;
    let home: HomePage;


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        // Log in to the application 
        home = await loginPage.login('standard_user', 'secret_sauce');
    });

    test('Filter by Price (Low to High)', async () => {
        await home.selectFilterOption('lohi');
        const sorted = await home.isProductsSorted('lohi');
        expect(sorted).toBeTruthy();
    });

    test('Filter by Price (High to Low)', async () => {
        await home.selectFilterOption('hilo');
        const sorted = await home.isProductsSorted('hilo');
        expect(sorted).toBeTruthy();
    });

    test('Filter by Name (A to Z)', async () => {
        await home.selectFilterOption('az');
        const sorted = await home.isProductsSorted('az');
        expect(sorted).toBeTruthy();
    });

    test('Filter by Name (Z to A)', async () => {
        await home.selectFilterOption('za');
        const sorted = await home.isProductsSorted('za');
        expect(sorted).toBeTruthy();
    });
});