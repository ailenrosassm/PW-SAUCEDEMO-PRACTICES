import { Page, Locator } from '@playwright/test';


export class InventoryPage {
readonly page: Page;
readonly inventoryItems: Locator;
readonly addToCartButton: (itemName: string) => Locator;
readonly cartBadge: Locator;
readonly cartLink: Locator;
readonly sortSelect: Locator;


constructor(page: Page) {
this.page = page;
this.inventoryItems = page.locator('.inventory_item');
this.addToCartButton = (itemName: string) => page.locator(`.inventory_item:has-text("${itemName}") button`);
this.cartBadge = page.locator('.shopping_cart_badge');
this.cartLink = page.locator('.shopping_cart_link');
this.sortSelect = page.locator('.product_sort_container');
}


async getItemsCount() {
return await this.inventoryItems.count();
}


async sortBy(optionValue: string) {
await this.sortSelect.selectOption({ value: optionValue });
}


async addItemToCart(itemName: string) {
await this.addToCartButton(itemName).click();
}


async getFirstItemPrice() {
const priceLocator = this.inventoryItems.first().locator('.inventory_item_price');
const text = await priceLocator.textContent();
return parseFloat((text || '$0').replace('$', '').trim());
}


async openCart() {
await this.cartLink.click();
}
}