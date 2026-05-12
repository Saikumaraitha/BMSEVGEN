export const AUTH_KEYS = {
  AUTH_TOKEN: 'evgen_token',
} as const

export const DUMMY_CREDENTIALS = {
  username: 'SuperAdmin',
  password: 'SecurePass123!',
} as const

export const LOGIN_CONTENT = {
  TITLE: 'Sign In',
  SUBTITLE: 'Welcome! Please login to continue',
  USERNAME_LABEL: 'Username',
  USERNAME_PLACEHOLDER: 'Enter your username',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  SUBMIT_BUTTON: 'Sign In',
  AUTHENTICATING: 'Authenticating…',
  ERROR_INVALID_CREDENTIALS: 'Invalid username or password. Please try again.',
  VALIDATION_USERNAME_REQUIRED: 'Username is required',
  VALIDATION_PASSWORD_REQUIRED: 'Password is required',
} as const
