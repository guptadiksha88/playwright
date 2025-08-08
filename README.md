Sauce Labs Demo - Automated Test Suite
This is the test suite for the Sauce Labs demo website (SauceDemo.com) built with Playwright and JavaScript. This test suite covers the complete customer journey from login to checkout completion with 3 random items.


Project Setup/Installation:

1. Install dependencies
    npm install
    npx playwright install

2. Create the Project directory and initialize it
   npm init -y

3. Create other Directories as per below Project structure
PlaywrightAssignment
    |-node_modules
    |-pages/
        |-Cart.js
        |-Checkout.js
        |-Inventory.js
        |-Login.js
    | -testData
        |-data.js
    |-tests 
        |-checkoutFloe.spec.js
    |-utils
        |-helper.js
    |-test-results
    |-.gitignore
    |-README.md
    |-package.json
    |-playwright.config.js



Coverage:
Complete E2E Testing: Full customer flow automation from login -> Randomly add 3 items to cart -> Checkout -> Order completion
Random Item Selection: Tests with 3 randomly selected items
Page Object Model: Clean, maintainable test architecture
Reporting HTML(default)
Screenshot & Video: Automatic capture on failures


Test Scenario
Flow:
1. Login with standard credentials
2. Add 3 random items to cart and Verify
3. Go to cart, verify items
4. Proceed to checkout and Verify
5. Fill in user information
6. Complete checkout
7. Assert checkout success


Running Tests:
Basic Test Execution
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run on specific browser
npx playwright test --project=chromium


