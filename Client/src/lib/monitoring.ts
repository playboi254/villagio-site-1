/**
 * Sentry Monitoring Integration
 * ─────────────────────────────
 * To enable Sentry:
 *   1. Add VITE_SENTRY_DSN to your .env file
 *   2. npm install @sentry/react
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SENTRY_DSN: string = (import.meta as any).env?.VITE_SENTRY_DSN ?? ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sentry: any = null

export const initSentry = async (): Promise<void> => {
  if (!SENTRY_DSN) {
    console.info('[Sentry] No DSN – monitoring disabled')
    return
  }
  try {
    // Dynamically import – no-op if @sentry/react is not installed
    const Sentry = await import('@sentry/react')
    Sentry.init({
      dsn: SENTRY_DSN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      environment: (import.meta as any).env?.MODE ?? 'development',
      tracesSampleRate: 0.2,
    })
    _sentry = Sentry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__SENTRY_DSN__ = SENTRY_DSN
    console.info('[Sentry] Initialized')
  } catch {
    // @sentry/react not installed — silently disable
  }
}

/** Report an error to Sentry */
export const captureError = (error: unknown, context?: Record<string, unknown>): void => {
  _sentry?.captureException?.(error, context)
}

/** Set the current user in Sentry */
export const setSentryUser = (user: { id: string; email: string }): void => {
  _sentry?.setUser?.(user)
}
