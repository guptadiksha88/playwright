export class Login {

    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.logoTitle = page.locator('.login_logo');
    }


    async gotoLoginPage() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }


    async login(username, password,page) {
        await this.usernameInput.fill(username);
        await this.page.waitForTimeout(2000);
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(2000);
        await this.loginButton.click();
        await this.page.waitForTimeout(2000);
    }

}