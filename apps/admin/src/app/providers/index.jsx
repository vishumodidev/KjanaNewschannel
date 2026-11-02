import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 minutes — admin data changes frequently
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: true,  // Keep admin data fresh
    },
    mutations: {
      retry: 0,
    },
  },
})

/**
 * Admin application providers.
 * Phase 2 will add AuthProvider, PermissionProvider, etc.
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

