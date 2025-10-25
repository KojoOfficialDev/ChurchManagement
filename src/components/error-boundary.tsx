import React, { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Card } from './ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'page' | 'section' | 'component'
  showDetails?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * A reusable error boundary component that catches errors in its child component tree
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback
 * <ErrorBoundary fallback={<div>Something went wrong!</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback function
 * <ErrorBoundary fallback={(error, reset) => (
 *   <div>
 *     <p>Error: {error.message}</p>
 *     <button onClick={reset}>Try again</button>
 *   </div>
 * )}>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * @example
 * // For different component sizes
 * <ErrorBoundary level="page">
 *   <FullPageComponent />
 * </ErrorBoundary>
 *
 * <ErrorBoundary level="section">
 *   <SectionComponent />
 * </ErrorBoundary>
 *
 * <ErrorBoundary level="component">
 *   <SmallWidget />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // You could also send error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index],
      )
    ) {
      this.reset()
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If custom fallback is provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.reset)
        }
        return this.props.fallback
      }

      // Default fallback UI based on level
      return this.renderDefaultFallback()
    }

    return this.props.children
  }

  private renderDefaultFallback(): ReactNode {
    const { level = 'section', showDetails = import.meta.env.DEV } = this.props
    const { error } = this.state

    const errorMessage = error?.message || 'An unexpected error occurred'

    switch (level) {
      case 'page':
        return (
          <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8 shadow-none border-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Something went wrong
                  </h1>
                  <p className="text-muted-foreground">
                    We're sorry, but something unexpected happened. Please try
                    again.
                  </p>
                </div>
                {showDetails && error && (
                  <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Details</AlertTitle>
                    <AlertDescription>
                      <code className="text-xs break-all">{errorMessage}</code>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.reset} size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'section':
        return (
          <div className="flex items-center justify-center p-6">
            <Card className="w-full p-6 shadow-none border-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">
                    Unable to load content
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This section encountered an error and couldn't be displayed.
                  </p>
                </div>
                {showDetails && error && (
                  <Alert variant="destructive" className="text-left text-xs">
                    <AlertDescription>
                      <code className="break-all">{errorMessage}</code>
                    </AlertDescription>
                  </Alert>
                )}
                <Button onClick={this.reset} size="sm">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Try Again
                </Button>
              </div>
            </Card>
          </div>
        )

      case 'component':
      default:
        return (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span className="text-xs">
                {showDetails ? errorMessage : 'Failed to load'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={this.reset}
                className="h-6 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        )
    }
  }
}

/**
 * Hook-based alternative for functional components (requires React 18+)
 * Note: This is a wrapper around the class-based ErrorBoundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
