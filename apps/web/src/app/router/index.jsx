import { createBrowserRouter, RouterProvider } from 'react-router'
import { PublicLayout } from '../layouts/PublicLayout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('../../features/home/HomePage.jsx')
          return { Component: HomePage }
        },
      },
      {
        path: 'news/:slug',
        lazy: async () => {
          const { ArticleDetailPage } = await import(
            '../../features/articles/ArticleDetailPage.jsx'
          )
          return { Component: ArticleDetailPage }
        },
      },
      {
        path: 'category/:slug',
        lazy: async () => {
          const { CategoryPage } = await import(
            '../../features/categories/CategoryPage.jsx'
          )
          return { Component: CategoryPage }
        },
      },
      {
        path: 'search',
        lazy: async () => {
          const { SearchPage } = await import(
            '../../features/search/SearchPage.jsx'
          )
          return { Component: SearchPage }
        },
      },
      {
        path: 'videos',
        lazy: async () => {
          const { VideosPage } = await import(
            '../../features/videos/VideosPage.jsx'
          )
          return { Component: VideosPage }
        },
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
