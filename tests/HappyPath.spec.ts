import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';


// Flow: Login -> Sort (Price low to high) -> Add cheapest item -> Open cart -> Checkout -> Verify total
// This is a typical end-to-end happy path: it verifies critical flows a user would take to purchase.


test.describe('SauceDemo - Happy Path', () => {
test('user can login, sort items, add to cart and reach checkout', 
async ({ page }) => {
const login = new LoginPage(page);
const inventory = new InventoryPage(page);


await login.goto();
await login.login('standard_user', 'secret_sauce');


// ensure we landed on inventory
await expect(page).toHaveURL(/inventory.html/);


// sort low to high (value for "Price (low to high)" is "lohi")
await inventory.sortBy('lohi');


// pick the first (cheapest) item and add to cart
const firstPrice = await inventory.getFirstItemPrice();
// store the price in test.info for debugging visibility
test.info().annotations.push({ type: 'note', description: `First item price: ${firstPrice}` });


const firstItemName = await page.locator('.inventory_item_name').first().textContent();
if (!firstItemName) throw new Error('No item name found');


await inventory.addItemToCart(firstItemName.trim());
await expect(inventory.cartBadge).toHaveText('1');


await inventory.openCart();
await expect(page).toHaveURL(/cart.html/);


// continue checkout flow (basic fields)
await page.locator('[data-test="checkout"]').click();
await expect(page).toHaveURL(/checkout-step-one.html/);


await page.locator('[data-test="firstName"]').fill('Ailen');
await page.locator('[data-test="lastName"]').fill('Rosas');
await page.locator('[data-test="postalCode"]').fill('85000');
await page.locator('[data-test="continue"]').click();


await expect(page).toHaveURL(/checkout-step-two.html/);


// Verify item price in summary matches the one we captured
const summaryPriceText = await page.locator('.inventory_item_price').textContent();
const summaryPrice = parseFloat((summaryPriceText || '$0').replace('$', '').trim());
expect(summaryPrice).toBeCloseTo(firstPrice, 2);


// Finish checkout
await page.locator('[data-test="finish"]').click();
await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
});