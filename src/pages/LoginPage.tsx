import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_KEYS, DUMMY_CREDENTIALS, LOGIN_CONTENT } from '../constants/authConstants'

interface FormState {
  username: string
  password: string
  showPassword: boolean
  errors: { username: string; password: string }
  apiError: string | null
  loading: boolean
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    showPassword: false,
    errors: { username: '', password: '' },
    apiError: null,
    loading: false,
  })

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEYS.AUTH_TOKEN)) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const validate = (): boolean => {
    const errors = { username: '', password: '' }
    let valid = true

    if (!form.username.trim()) {
      errors.username = LOGIN_CONTENT.VALIDATION_USERNAME_REQUIRED
      valid = false
    }
    if (!form.password) {
      errors.password = LOGIN_CONTENT.VALIDATION_PASSWORD_REQUIRED
      valid = false
    }

    setForm(prev => ({ ...prev, errors }))
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: '' },
      apiError: null,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setForm(prev => ({ ...prev, loading: true, apiError: null }))

    setTimeout(() => {
      if (
        form.username === DUMMY_CREDENTIALS.username &&
        form.password === DUMMY_CREDENTIALS.password
      ) {
        localStorage.setItem(AUTH_KEYS.AUTH_TOKEN, 'dummy-auth-token-evgen')
        navigate('/', { replace: true })
      } else {
        setForm(prev => ({
          ...prev,
          loading: false,
          apiError: LOGIN_CONTENT.ERROR_INVALID_CREDENTIALS,
        }))
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-100)]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-neutral-900)]">{LOGIN_CONTENT.TITLE}</h2>
          <p className="text-sm text-[var(--color-neutral-500)] mt-1">
            {LOGIN_CONTENT.SUBTITLE}
          </p>
        </div>

        {form.apiError && (
          <div className="mb-4 flex items-start gap-2 bg-error-bg border border-error-border text-error-text rounded-lg px-4 py-3 text-sm">
            <span className="flex-1">{form.apiError}</span>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, apiError: null }))}
              className="text-error-icon hover:text-error-dark leading-none"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[var(--color-neutral-500)] mb-1">
              {LOGIN_CONTENT.USERNAME_LABEL}
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              placeholder={LOGIN_CONTENT.USERNAME_PLACEHOLDER}
              onChange={handleChange}
              disabled={form.loading}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 ${
                form.errors.username ? 'border-error-icon' : 'border-[var(--color-neutral-300)]'
              }`}
            />
            {form.errors.username && (
              <p className="mt-1 text-xs text-error">{form.errors.username}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-[var(--color-neutral-500)] mb-1">
              {LOGIN_CONTENT.PASSWORD_LABEL}
            </label>
            <div className="relative">
              <input
                type={form.showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                placeholder={LOGIN_CONTENT.PASSWORD_PLACEHOLDER}
                onChange={handleChange}
                disabled={form.loading}
                className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 ${
                  form.errors.password ? 'border-error-icon' : 'border-[var(--color-neutral-300)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute inset-y-0 right-2 flex items-center text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                tabIndex={-1}
              >
                {form.showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {form.errors.password && (
              <p className="mt-1 text-xs text-error">{form.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.loading}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {form.loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {LOGIN_CONTENT.AUTHENTICATING}
              </>
            ) : (
              LOGIN_CONTENT.SUBMIT_BUTTON
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
