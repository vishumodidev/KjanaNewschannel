import { Providers } from './app/providers/index.jsx'
import { AppRouter } from './app/router/index.jsx'

/**
 * Root application component.
 * Composes context providers (React Query, Theme, etc.) around the router.
 */
export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

