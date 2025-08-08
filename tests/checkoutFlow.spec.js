import {test, expect} from '@playwright/test';
import {Login} from '../pages/Login.js';
import {Inventory} from '../pages/Inventory.js';
import {Cart} from '../pages/Cart.js';
import {Checkout} from '../pages/Checkout.js';
import {LOGIN_CREDENTIALS, generateTestScenario} from '../testData/data.js';


test.describe(' shopping Checkout Flow', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({page}) => {
        loginPage = new Login(page);
        inventoryPage = new Inventory(page);
        cartPage = new Cart(page);
        checkoutPage = new Checkout(page);

        await loginPage.gotoLoginPage();
    });

    test('Complete checkout flow with 3 random items', async ({page}) => {
        test.setTimeout(80000);
        const testScenario = generateTestScenario(3);
        const customerInfo = testScenario.customer;

        await test.step('User logs in successfully with the given credentials', async () => {
            await expect(loginPage.logoTitle).toBeVisible();
            await loginPage.login(
                LOGIN_CREDENTIALS.username,
                LOGIN_CREDENTIALS.password
            );
            await expect(inventoryPage.pageTitle).toBeVisible();
            expect(await inventoryPage.verifyInventoryPageLoaded()).toBe(true);
        });


        let selectedItems = [];
        await test.step('User selects 3 random items and adds them to cart', async () => {
            selectedItems = await inventoryPage.addItemsToCart(3);
            expect(selectedItems).toHaveLength(3);
        });


        await test.step('User navigates to cart and verifies selected items', async () => {
            await inventoryPage.goToShoppingCart();
            expect(await cartPage.verifyCartPageLoaded()).toBe(true);
            const cartItems = await cartPage.getCartItems();
            expect(cartItems).toHaveLength(3);
            const verificationResults = await cartPage.verifyItemsInCart(selectedItems);
            for (const result of verificationResults) {
                expect(result.found).toBe(true);
            }
        });


        await test.step('User proceeds to checkout', async () => {
            await cartPage.proceedToCheckout();
            expect(await checkoutPage.verifyCheckoutPageLoad()).toBe(true);
        });


        await test.step('User fills User information', async () => {
            await checkoutPage.fillCheckoutInformation(customerInfo);
        });


        await test.step('User continues to checkout overview', async () => {
            await checkoutPage.continueToCheckoutOverview();
            expect(await checkoutPage.verifyCheckoutOverviewPage()).toBe(true);
        });


        let orderSummary;
        await test.step('User verifies order summary and pricing calculations', async () => {
            orderSummary = await checkoutPage.getOrderSummary();

            const expectedSubtotal = checkoutPage.calculateExpectedSubtotal(orderSummary.items);
            const actualSubtotal = checkoutPage.extractPriceValue(orderSummary.subtotal);
            expect(actualSubtotal).toBe(expectedSubtotal);

            expect(orderSummary.paymentInfo).toContain('SauceCard');
            expect(orderSummary.shippingInfo).toContain('Free Pony Express Delivery!');
        });


        await test.step('User completes the checkout process', async () => {
            await checkoutPage.finishCheckout();
            const completionStatus = await checkoutPage.verifyFinishCheckout();
            expect(completionStatus.isComplete).toBe(true);
            expect(completionStatus.header).toBe('Thank you for your order!');
            expect(completionStatus.text).toContain('Your order has been dispatched');
        });

    });

});
