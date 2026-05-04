# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\user.gherkin.spec.ts >> User gherkin scenarios @gherkin >> Scenario: Visitor signs up and lands in user area @user @signup
- Location: e2e\user\user.gherkin.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('user-page')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('user-page')

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
  2  | import { userPageTestIds } from '../auth-test-ids';
  3  | 
  4  | export class UserPage {
  5  |   constructor(private readonly page: Page) {}
  6  | 
  7  |   async expectVisible(): Promise<void> {
> 8  |     await expect(this.page.getByTestId(userPageTestIds.page)).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  9  |     await expect(this.page.getByTestId(userPageTestIds.title)).toBeVisible();
  10 |   }
  11 | 
  12 |   async changeLocale(locale: string): Promise<void> {
  13 |     await this.page.context().addCookies([
  14 |       {
  15 |         name: 'locale',
  16 |         value: locale,
  17 |         domain: '127.0.0.1',
  18 |         path: '/',
  19 |       },
  20 |     ]);
  21 |     await this.page.reload();
  22 |   }
  23 | 
  24 |   async expectLocale(locale: string): Promise<void> {
  25 |     await expect(this.page.locator('html')).toHaveAttribute('lang', locale);
  26 |   }
  27 | 
  28 |   async signOut(): Promise<void> {
  29 |     await this.page.getByTestId(userPageTestIds.signoutButton).click();
  30 |   }
  31 | }
  32 | 
```