import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { AdminLayout } from '../layouts/AdminLayout.jsx'

// ── Admin route definitions ───────────────────────────────────────────────────
// ProtectedRoute wrapper is added in Phase 2 (after auth implementation).
// All admin routes will require authentication and appropriate permissions.

const router = createBrowserRouter([
  {
    // Public admin routes (no auth required)
    path: '/login',
    lazy: async () => {
      const { LoginPage } = await import('../../features/authentication/LoginPage.jsx')
      return { Component: LoginPage }
    },
  },

  {
    // Protected admin shell
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { DashboardPage } = await import('../../features/dashboard/DashboardPage.jsx')
          return { Component: DashboardPage }
        },
      },
      {
        path: 'articles',
        lazy: async () => {
          const { ArticlesListPage } = await import('../../features/articles/ArticlesListPage.jsx')
          return { Component: ArticlesListPage }
        },
      },
      {
        path: 'articles/new',
        lazy: async () => {
          const { ArticleEditorPage } = await import('../../features/articles/ArticleEditorPage.jsx')
          return { Component: ArticleEditorPage }
        },
      },
      {
        path: 'editorial/queue',
        lazy: async () => {
          const { ReviewQueuePage } = await import('../../features/editorial/ReviewQueuePage.jsx')
          return { Component: ReviewQueuePage }
        },
      },
      {
        path: 'translations',
        lazy: async () => {
          const { TranslationsPage } = await import('../../features/translations/TranslationsPage.jsx')
          return { Component: TranslationsPage }
        },
      },
      // { path: 'media',                lazy: () => ... }
      // { path: 'users',                lazy: () => ... }
      // { path: 'roles',                lazy: () => ... }
      // { path: 'categories',           lazy: () => ... }
      // { path: 'advertisements',       lazy: () => ... }
      // { path: 'analytics',            lazy: () => ... }
      // { path: 'audit-logs',           lazy: () => ... }
    ],
  },
])

/**
 * Admin CMS router.
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}

