import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ── React Query client ────────────────────────────────────────────────────────
// Shared across the entire application.
// Configure global defaults for queries and mutations here.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes — news data refreshes periodically
      gcTime: 1000 * 60 * 10,     // 10 minutes — keep unused cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

/**
 * Composes all application-level context providers.
 * Add new providers here (Theme, Auth, I18n, etc.) as they are implemented.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

