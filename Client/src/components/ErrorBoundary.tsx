import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary – catches rendering errors in sub-trees
 * and prevents the entire UI from crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Report to Sentry if configured
    if (typeof window !== 'undefined' && (window as any).__SENTRY_DSN__) {
      try {
        const Sentry = (window as any).Sentry;
        if (Sentry?.captureException) Sentry.captureException(error, { extra: info });
      } catch {}
    }
    console.error('ErrorBoundary caught:', error, info);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-5xl">🌿</div>
          <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
          <p className="text-gray-500 max-w-sm">
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-left bg-red-50 p-4 rounded-lg w-full max-w-lg">
              <summary className="font-mono text-sm text-red-600 cursor-pointer">Error details (dev only)</summary>
              <pre className="text-xs text-red-800 mt-2 overflow-auto">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
