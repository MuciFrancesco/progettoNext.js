export const authTestIds = {
  root: 'auth-root',
  serverError: 'auth-server-error',
  modeSigninTab: 'auth-mode-signin-tab',
  modeSignupTab: 'auth-mode-signup-tab',
  signinForm: 'signin-form',
  signinEmailInput: 'signin-email-input',
  signinPasswordInput: 'signin-password-input',
  signinEmailError: 'signin-email-error',
  signinPasswordError: 'signin-password-error',
  signinSubmitButton: 'signin-submit-button',
  signinWarningAlert: 'signin-warning-alert',
  signinBlockedAlert: 'signin-blocked-alert',
  signinGoogleButton: 'signin-google-button',
  signinFacebookButton: 'signin-facebook-button',
  signinAppleButton: 'signin-apple-button',
  signupForm: 'signup-form',
  signupFirstNameInput: 'signup-firstname-input',
  signupLastNameInput: 'signup-lastname-input',
  signupEmailInput: 'signup-email-input',
  signupEmailError: 'signup-email-error',
  signupFirstNameError: 'signup-firstname-error',
  signupLastNameError: 'signup-lastname-error',
  signupPasswordInput: 'signup-password-input',
  signupPasswordError: 'signup-password-error',
  signupSubmitButton: 'signup-submit-button',
} as const;

export const homeTestIds = {
  page: 'home-page',
  brand: 'home-brand',
  title: 'home-title',
  subtitle: 'home-subtitle',
} as const;

export const localeSwitcherTestIds = {
  home: {
    root: 'login-locale-switcher-root',
    label: 'login-locale-switcher-label',
    select: 'login-locale-switcher-select',
  },
  user: {
    root: 'user-locale-switcher-root',
    label: 'user-locale-switcher-label',
    select: 'user-locale-switcher-select',
  },
  admin: {
    root: 'admin-locale-switcher-root',
    label: 'admin-locale-switcher-label',
    select: 'admin-locale-switcher-select',
  },
} as const;

export const userPageTestIds = {
  page: 'user-page',
  title: 'user-page-title',
  greeting: 'user-page-greeting',
  signoutButton: 'user-header-signout-button',
} as const;

export const adminPageTestIds = {
  page: 'admin-dashboard-page',
  title: 'admin-dashboard-title',
  count: 'admin-dashboard-count',
  navbar: 'admin-navbar',
  dashboardLink: 'admin-nav-dashboard-link',
  userLink: 'admin-nav-user-link',
  signoutButton: 'admin-signout-button',
  usersGrid: 'admin-users-grid',
} as const;
