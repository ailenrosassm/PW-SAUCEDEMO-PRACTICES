import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';


// This test is intentionally written to *find a bug* or a failing scenario.
// It checks that the displayed item total at checkout equals the sum of item prices.
// In real-world runs you might find rounding/tax calculation or DOM issues causing this to fail.


test.describe('SauceDemo - Bug Hunting', () => {
test('checkout item total equals sum of item prices (may fail if there is a bug)', async ({ page }) => {
const login = new LoginPage(page);
const inventory = new InventoryPage(page);

await login.goto();
await login.login('standard_user', 'secret_sauce');
await expect(page).toHaveURL(/inventory.html/);


// Add two items: the first and second visible
const names = await page.locator('.inventory_item_name').allTextContents();
if (names.length < 2) throw new Error('Not enough items on inventory to run this test');


const item1 = names[0].trim();
const item2 = names[1].trim();


await inventory.addItemToCart(item1);
await inventory.addItemToCart(item2);


await inventory.openCart();
await expect(page).toHaveURL(/cart.html/);


// go to checkout and fill details
await page.locator('[data-test="checkout"]').click();
await page.locator('[data-test="firstName"]').fill('Ailen');
await page.locator('[data-test="lastName"]').fill('Rosas');
await page.locator('[data-test="postalCode"]').fill('85000');
await page.locator('[data-test="continue"]').click();


// capture item total displayed on checkout overview
const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
// example: "Item total: $39.98"
const itemTotal = parseFloat((itemTotalText || '0').replace(/[^0-9.]/g, ''));


// compute sum of individual prices shown
const priceLocators = page.locator('.cart_item .inventory_item_price');
const prices = await priceLocators.allTextContents();
const sum = prices.map(p => parseFloat(p.replace('$','').trim())).reduce((a,b) => a + b, 0);


// INTENTIONAL ASSERTION: itemTotal MUST equal sum.
// If this fails, it demonstrates a bug (e.g., rounding/tax miscalculation or DOM discrepancy).
expect(itemTotal).toBeCloseTo(sum, 2);
});
});