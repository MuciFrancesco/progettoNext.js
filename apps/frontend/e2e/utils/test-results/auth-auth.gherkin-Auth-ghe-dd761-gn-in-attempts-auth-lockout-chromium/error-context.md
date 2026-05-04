# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\auth.gherkin.spec.ts >> Auth gherkin scenarios @gherkin >> Scenario: Registered user gets blocked after repeated failed sign in attempts @auth @lockout
- Location: e2e\auth\auth.gherkin.spec.ts:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('auth-server-error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('auth-server-error')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - banner [ref=e12]:
    - generic [ref=e13]:
      - link "ThinkShop home" [ref=e14] [cursor=pointer]:
        - /url: /login
        - generic [ref=e15]: ThinkShop
      - generic [ref=e17]:
        - generic [ref=e18]: Lingua
        - combobox "Lingua" [ref=e19]:
          - option "Italiano" [selected]
          - option "Inglese"
          - option "Francese"
          - option "Spagnolo"
          - option "Tedesco"
  - main [ref=e20]:
    - generic [ref=e22]:
      - generic [ref=e23]: Accedi alla tua area
      - group [ref=e24]:
        - button "Sign in" [pressed] [ref=e25] [cursor=pointer]
        - button "Sign up" [ref=e26] [cursor=pointer]
      - generic [ref=e27]:
        - generic [ref=e30]: Sign in
        - generic [ref=e32]:
          - generic [ref=e33]:
            - generic [ref=e34]: Email
            - generic [ref=e35]:
              - textbox "Email" [active] [ref=e36]
              - group:
                - generic: Email
          - generic [ref=e37]:
            - generic: Password
            - generic [ref=e38]:
              - textbox "Password" [ref=e39]
              - group:
                - generic: Password
          - link "Password dimenticata?" [ref=e41] [cursor=pointer]:
            - /url: /forgot-password
          - button "Entra" [ref=e42] [cursor=pointer]
          - separator [ref=e43]:
            - heading "Oppure accedi con:" [level=6] [ref=e45]
          - generic [ref=e46]:
            - link "Google" [ref=e47] [cursor=pointer]:
              - /url: http://localhost:3333/auth/google
              - img [ref=e49]
              - text: Google
            - link "Meta" [ref=e54] [cursor=pointer]:
              - /url: http://localhost:3333/auth/facebook
              - img [ref=e56]
              - text: Meta
            - link "Apple" [ref=e58] [cursor=pointer]:
              - /url: http://localhost:3333/auth/apple
              - img [ref=e60]
              - text: Apple
      - generic [ref=e62]: © 2026 ThinkShop. Tutti i diritti riservati.
```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | import { authTestIds, localeSwitcherTestIds } from '../auth-test-ids';
  3  | 
  4  | export class AuthPage {
  5  |   constructor(private readonly page: Page) {}
  6  | 
  7  |   async goto(mode: 'signin' | 'signup' = 'signin'): Promise<void> {
  8  |     await this.page.goto(`/login?mode=${mode}`);
  9  |     await expect(this.page.getByTestId('login-page')).toBeVisible();
  10 |     await expect(this.page.getByTestId(authTestIds.root)).toBeVisible();
  11 |   }
  12 | 
  13 |   async switchToSignup(): Promise<void> {
  14 |     await this.goto('signup');
  15 |     await expect(this.page.getByTestId(authTestIds.signupForm)).toBeVisible();
  16 |   }
  17 | 
  18 |   async submitWeakSignup(password: string): Promise<void> {
  19 |     await this.page.getByTestId(authTestIds.signupFirstNameInput).fill('Play');
  20 |     await this.page.getByTestId(authTestIds.signupLastNameInput).fill('Wright');
  21 |     await this.page.getByTestId(authTestIds.signupEmailInput).fill(`pw-${Date.now()}@example.com`);
  22 |     await this.page.getByTestId(authTestIds.signupPasswordInput).fill(password);
  23 |     await this.page.getByTestId(authTestIds.signupPasswordInput).blur();
  24 |   }
  25 | 
  26 |   async expectWeakPasswordState(): Promise<void> {
  27 |     await expect(this.page.getByTestId(authTestIds.signupPasswordInput)).toHaveAttribute(
  28 |       'data-validation-state',
  29 |       'weak'
  30 |     );
  31 |     await expect(this.page.getByTestId(authTestIds.signupPasswordError)).toHaveAttribute(
  32 |       'data-validation-state',
  33 |       'weak'
  34 |     );
  35 |   }
  36 | 
  37 |   async signUp(user: { email: string; password: string }): Promise<void> {
  38 |     await this.goto('signup');
  39 |     await expect(this.page.getByTestId(authTestIds.signupForm)).toBeVisible();
  40 |     await this.page.getByTestId(authTestIds.signupFirstNameInput).fill('Play');
  41 |     await this.page.getByTestId(authTestIds.signupLastNameInput).fill('Wright');
  42 |     await this.page.getByTestId(authTestIds.signupEmailInput).fill(user.email);
  43 |     await this.page.getByTestId(authTestIds.signupPasswordInput).fill(user.password);
  44 |     await this.page.getByTestId(authTestIds.signupSubmitButton).click();
  45 |   }
  46 | 
  47 |   async signIn(user: { email: string; password: string }): Promise<void> {
  48 |     await this.goto();
  49 |     await this.page.getByTestId(authTestIds.signinEmailInput).fill(user.email);
  50 |     await this.page.getByTestId(authTestIds.signinPasswordInput).fill(user.password);
  51 |     await this.page.getByTestId(authTestIds.signinSubmitButton).click();
  52 |   }
  53 | 
  54 |   async submitWrongCredentials(email: string, attempts: number): Promise<void> {
  55 |     for (let i = 0; i < attempts; i += 1) {
  56 |       await this.page.getByTestId(authTestIds.signinEmailInput).fill(email);
  57 |       await this.page.getByTestId(authTestIds.signinPasswordInput).fill('Wrong$Pass1');
  58 |       await this.page.getByTestId(authTestIds.signinSubmitButton).click();
> 59 |       await expect(this.page.getByTestId(authTestIds.serverError)).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  60 |     }
  61 |   }
  62 | 
  63 |   async changeLocale(locale: string): Promise<void> {
  64 |     await this.page.getByTestId(localeSwitcherTestIds.home.select).selectOption(locale);
  65 |   }
  66 | }
  67 | 
```