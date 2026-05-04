# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\user.gherkin.spec.ts >> User gherkin scenarios @gherkin >> Scenario: Authenticated user changes locale and signs out @user @locale
- Location: e2e\user\user.gherkin.spec.ts:40:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('signin-form')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('signin-form')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - banner [ref=e13]:
      - generic [ref=e14]:
        - link [ref=e15] [cursor=pointer]:
          - /url: /
          - generic [ref=e16]: ThinkShop
        - generic [ref=e17]:
          - link [ref=e18] [cursor=pointer]:
            - /url: /cart
            - img [ref=e21]
            - text: Cart
          - generic [ref=e23]:
            - link [ref=e24] [cursor=pointer]:
              - /url: /user/orders
              - text: My orders
            - button [ref=e25]: Sign out
    - main [ref=e26]:
      - generic [ref=e27]:
        - heading [level=1] [ref=e29]: User area
        - paragraph [ref=e30]: Hi User, you are authenticated as a standard user.
        - link [ref=e32] [cursor=pointer]:
          - /url: /user/orders
          - generic [ref=e33]: 🛍️
          - paragraph [ref=e34]: My orders
          - img [ref=e35]
    - dialog [ref=e37]:
      - heading [level=6] [ref=e38]: This site uses cookies
      - paragraph [ref=e39]: We use technical cookies necessary for the site to work (art. 122 D.Lgs. 196/2003) and, with your consent, analytics and marketing cookies (GDPR art. 6.1.a). You can accept all, reject non-essential ones or customise your preferences.
      - generic [ref=e40]:
        - button [ref=e41] [cursor=pointer]: Customise
        - button [ref=e42] [cursor=pointer]: Reject non-essential
        - button [ref=e43] [cursor=pointer]: Accept all
    - contentinfo [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic [ref=e48]:
            - generic [ref=e49]: Navigation
            - link [ref=e50] [cursor=pointer]:
              - /url: /user
              - text: User area
            - link [ref=e51] [cursor=pointer]:
              - /url: /user/orders
              - text: My orders
          - generic [ref=e53]:
            - generic [ref=e54]: Legal
            - link [ref=e55] [cursor=pointer]:
              - /url: /privacy
              - text: Privacy
            - link [ref=e56] [cursor=pointer]:
              - /url: /terms
              - text: Terms of service
          - generic [ref=e58]:
            - generic [ref=e59]: Support
            - link [ref=e60] [cursor=pointer]:
              - /url: /contact
              - text: Contact us
        - separator [ref=e61]
        - generic [ref=e62]:
          - paragraph [ref=e63]: ThinkShop
          - generic [ref=e64]: © 2026 ThinkShop. All rights reserved.
          - generic [ref=e65]: Thank you for choosing ThinkShop!
  - dialog "Confirm sign out" [ref=e68]:
    - heading "Confirm sign out" [level=2] [ref=e69]
    - paragraph [ref=e71]: Are you sure you want to sign out?
    - generic [ref=e72]:
      - button "Cancel" [ref=e73] [cursor=pointer]
      - button "Sign out" [ref=e74] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, type APIRequestContext, type Page } from '@playwright/test';
  2  | import { authTestIds, localeSwitcherTestIds } from '../utils/support/auth-test-ids';
  3  | import { AuthPage } from '../utils/support/pages/auth-page';
  4  | import { AdminPage } from '../utils/support/pages/admin-page';
  5  | import { UserPage } from '../utils/support/pages/user-page';
  6  | import {
  7  |   buildTestUser,
  8  |   isBackendReachable,
  9  |   registerUser,
  10 |   signInViaApi,
  11 | } from '../utils/support/auth-api';
  12 | 
  13 | export async function givenBackendIsReachable(request: APIRequestContext): Promise<void> {
  14 |   expect(await isBackendReachable(request)).toBeTruthy();
  15 | }
  16 | 
  17 | export async function whenVisitorSignsUpAsStandardUser(page: Page): Promise<void> {
  18 |   const authPage = new AuthPage(page);
  19 |   const user = buildTestUser('USER', 'signup');
  20 |   await authPage.signUp(user);
  21 | }
  22 | 
  23 | export async function thenVisitorReachesUserArea(page: Page): Promise<void> {
  24 |   const userPage = new UserPage(page);
  25 |   await userPage.expectVisible();
  26 | }
  27 | 
  28 | export async function givenSignedInStandardUserExists(
  29 |   page: Page,
  30 |   request: APIRequestContext
  31 | ): Promise<void> {
  32 |   const user = buildTestUser('USER', 'user-area');
  33 |   await registerUser(request, user);
  34 |   await signInViaApi(request, page.context(), user);
  35 |   await page.goto('/user');
  36 |   await new UserPage(page).expectVisible();
  37 | }
  38 | 
  39 | export async function whenUserSwitchesLocale(page: Page, locale: string): Promise<void> {
  40 |   const userPage = new UserPage(page);
  41 |   await userPage.changeLocale(locale);
  42 |   await userPage.expectLocale(locale);
  43 | }
  44 | 
  45 | export async function whenUserSignsOut(page: Page): Promise<void> {
  46 |   const userPage = new UserPage(page);
  47 |   await userPage.signOut();
  48 | }
  49 | 
  50 | export async function thenVisitorReturnsToAuthPage(page: Page): Promise<void> {
> 51 |   await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  52 | }
  53 | 
  54 | export async function whenUserOpensAdminDashboard(page: Page): Promise<void> {
  55 |   const adminPage = new AdminPage(page);
  56 |   await adminPage.goto();
  57 | }
  58 | 
  59 | export async function thenVisitorRedirectedToUserArea(page: Page): Promise<void> {
  60 |   await new AdminPage(page).expectRedirectedToUserArea();
  61 |   await expect(page.getByTestId(localeSwitcherTestIds.user.select)).toBeVisible();
  62 | }
  63 | 
  64 | export async function givenAnonymousVisitor(page: Page): Promise<void> {
  65 |   await page.context().clearCookies();
  66 | }
  67 | 
  68 | export async function thenVisitorRedirectedToAuthPage(page: Page): Promise<void> {
  69 |   await new AdminPage(page).expectRedirectedToAuth();
  70 |   await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
  71 | }
  72 | 
```