
export class Cart {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');

    }


    async verifyCartPageLoaded() {
        await this.pageTitle.waitFor({ state: 'visible' });
        const title = await this.pageTitle.textContent();
        return title === 'Your Cart';
    }


    async getCartItems() {
        const items = [];
        const itemElements = await this.cartItems.all();

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
        return items;
    }


    async verifyItemsInCart(expectedItems) {
        const cartItems = await this.getCartItems();
        const results = [];

        for (const expectedItem of expectedItems) {
            const foundItem = cartItems.find(cartItem =>
                cartItem.name === expectedItem.name && cartItem.price === expectedItem.price
            );
            results.push({
                item: expectedItem,
                found: !!foundItem
            });
        }
        return results;
    }


    async proceedToCheckout() {
        await this.checkoutButton.click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState('networkidle');
    }

}