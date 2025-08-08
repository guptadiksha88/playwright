
export class Inventory {

    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
    }

    async verifyInventoryPageLoaded() {
        await this.pageTitle.waitFor({ state: 'visible' });
        const title = await this.pageTitle.textContent();
        return title === 'Products';
    }

    async getInventoryItems() {
        await this.inventoryItems.first().waitFor({ state: 'visible' });
        return await this.inventoryItems.all();
    }

    async getRandomItems(count = 3) {
        const items = await this.getInventoryItems();
        const itemsData = [];
        const randomItemsList = Array.from({ length: items.length }, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, count);

        for (const index of randomItemsList) {
            const item = items[index];
            const nameElement = item.locator('.inventory_item_name');
            const priceElement = item.locator('.inventory_item_price');
            const addToCartButton = item.locator('[data-test*="add-to-cart"]');

            const name = await nameElement.textContent();
            const price = await priceElement.textContent();

            itemsData.push({
                element: item,
                name: name,
                price: price,
                addToCartButton: addToCartButton,
                index: index
            });
        }

        return itemsData;
    }


    async addItemsToCart(count = 3) {
        const randomItems = await this.getRandomItems(count);
        const addedItems = [];

        for (const item of randomItems) {
            await item.addToCartButton.click();
            addedItems.push({
                name: item.name,
                price: item.price
            });
            await this.page.waitForTimeout(1500);
        }
        return addedItems;
    }


    async goToShoppingCart() {
        await this.shoppingCartLink.click();
        await this.page.waitForTimeout(4000);
        await this.page.waitForLoadState('networkidle');
    }

}