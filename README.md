# Playwright SauceDemo POM Example 🚀

This repository contains an automated test project built with **Playwright + TypeScript**, following the **Page Object Model (POM)** structure.  
It is designed as a real-world QA Automation portfolio example and includes both **happy-path tests** and **a failing scenario** intended to detect functional inconsistencies.

---

# ✔️ What this project demonstrates

# ✅ 1. Parallel Test Execution  
Using Playwright’s configuration:
- `fullyParallel: true`
- `workers: 4`

This optimizes execution time and simulates CI/CD performance (Jenkins, GitHub Actions).

# ✅ 2. Page Object Model (POM)  
Reusable, scalable components:
- `LoginPage`
- `InventoryPage`

# ✅ 3. Real E2E Happy Path  
Flow:
1. Login  
2. Sort products by price (Low → High)  
3. Add the cheapest item to cart  
4. Proceed through checkout  
5. Validate that price consistency is maintained  

# ✅ 4. Bug-Hunting Test (Intentional Failing Test)  
Includes a test validating:
- **Item Total displayed vs. sum of individual item prices**

This test is designed to expose potential UI calculation issues.

---

# ▶️ How to run locally

1. Install dependencies:
   ```bash
   npm install
   npx playwright install
   npm test
   npx playwright show-report
   npx playwright test --headed
