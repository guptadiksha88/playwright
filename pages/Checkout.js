
export class Checkout {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.checkoutItems = page.locator('.cart_item');
        this.paymentInfo = page.locator('[data-test="payment-info-value"]');
        this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
        this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
        this.taxLabel = page.locator('[data-test="tax-label"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
    }


    async verifyCheckoutPageLoad() {
        await this.pageTitle.waitFor({ state: 'visible' });
        const title = await this.pageTitle.textContent();
        return title === 'Checkout: Your Information';
    }


    async fillCheckoutInformation(customerInfo) {
        await this.firstNameInput.fill(customerInfo.firstName);
        await this.page.waitForTimeout(1000);
        await this.lastNameInput.fill(customerInfo.lastName);
        await this.page.waitForTimeout(1000);
        await this.postalCodeInput.fill(customerInfo.postalCode);
        await this.page.waitForTimeout(1000);
    }


    async continueToCheckoutOverview() {
        await this.continueButton.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('networkidle');
    }



    async verifyCheckoutOverviewPage() {
        await this.pageTitle.waitFor({ state: 'visible' });
        const title = await this.pageTitle.textContent();
        return title === 'Checkout: Overview';
    }

    /**
     * Get order summary information
     */
    async getOrderSummary() {
        const items = [];
        const itemElements = await this.checkoutItems.all();

        for (const item of itemElements) {
            const name = await item.locator('.inventory_item_name').textContent();
            const price = await item.locator('.inventory_item_price').textContent();
            const quantity = await item.locator('.cart_quantity').textContent();

            items.push({
                name: name,
                price: price,
                quantity: parseInt(quantity, 10)
            });
        }

        const subtotal = await this.subtotalLabel.textContent();
        const tax = await this.taxLabel.textContent();
        const total = await this.totalLabel.textContent();
        const paymentInfo = await this.paymentInfo.textContent();
        const shippingInfo = await this.shippingInfo.textContent();

        return {
            items: items,
            subtotal: subtotal,
            tax: tax,
            total: total,
            paymentInfo: paymentInfo,
            shippingInfo: shippingInfo
        };
    }


    async finishCheckout() {
        await this.finishButton.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('networkidle');
    }


    async verifyFinishCheckout() {
        await this.completeHeader.waitFor({ state: 'visible' });
        const header = await this.completeHeader.textContent();
        const text = await this.completeText.textContent();

        return {
            header: header,
            text: text,
            isComplete: header === 'Thank you for your order!' &&
                text.includes('Your order has been dispatched')
        };
    }


    calculateExpectedSubtotal(items) {
        return items.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    extractPriceValue(priceText) {
        const match = priceText.match(/\$(\d+\.\d{2})/);
        return match ? parseFloat(match[1]) : 0;
    }

}