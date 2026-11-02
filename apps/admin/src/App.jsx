import { Providers } from './app/providers/index.jsx'
import { AppRouter } from './app/router/index.jsx'

/**
 * Admin CMS root component.
 * Composes providers and the admin router.
 */
export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

