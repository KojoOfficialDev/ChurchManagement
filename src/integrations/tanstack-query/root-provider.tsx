import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  // Ensure a single QueryClient instance across the app
  // This avoids creating new clients on each import/call which would lose cache
  // and force refetches even when data should be served from cache.
  const globalObj = (globalThis || window) as unknown as {
    __TANSTACK_QUERY_CLIENT__?: QueryClient
  }

  if (!globalObj.__TANSTACK_QUERY_CLIENT__) {
    globalObj.__TANSTACK_QUERY_CLIENT__ = new QueryClient()
  }

  return {
    queryClient: globalObj.__TANSTACK_QUERY_CLIENT__,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
