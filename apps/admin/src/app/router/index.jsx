import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { AdminLayout } from '../layouts/AdminLayout.jsx'
import { AdminErrorBoundary } from './ErrorBoundary.jsx'
import { NotFoundPage } from './NotFoundPage.jsx'

// ── Admin route definitions ───────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    // Public admin routes (no auth required)
    path: '/login',
    errorElement: <AdminErrorBoundary />,
    lazy: async () => {
      const { LoginPage } = await import('../../features/authentication/LoginPage.jsx')
      return { Component: LoginPage }
    },
  },

  {
    // Protected admin shell
    path: '/',
    element: <AdminLayout />,
    errorElement: <AdminErrorBoundary />,
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
      {
        path: 'media',
        lazy: async () => {
          const { MediaLibraryPage } = await import('../../features/media/MediaLibraryPage.jsx')
          return { Component: MediaLibraryPage }
        },
      },
      {
        path: 'users',
        lazy: async () => {
          const { StaffDirectoryPage } = await import('../../features/staff/StaffDirectoryPage.jsx')
          return { Component: StaffDirectoryPage }
        },
      },
      {
        path: 'roles',
        lazy: async () => {
          const { RolesPermissionsPage } = await import('../../features/roles/RolesPermissionsPage.jsx')
          return { Component: RolesPermissionsPage }
        },
      },
      {
        path: 'analytics',
        lazy: async () => {
          const { AnalyticsPage } = await import('../../features/analytics/AnalyticsPage.jsx')
          return { Component: AnalyticsPage }
        },
      },
      {
        path: 'audit-logs',
        lazy: async () => {
          const { AuditLogsPage } = await import('../../features/audit/AuditLogsPage.jsx')
          return { Component: AuditLogsPage }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsPage } = await import('../../features/settings/SettingsPage.jsx')
          return { Component: SettingsPage }
        },
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

/**
 * Admin CMS router.
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}
