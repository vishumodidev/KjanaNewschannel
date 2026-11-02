// ── TanStack Query key factory ────────────────────────────────────────────────
// Centralising query keys prevents typos and makes cache invalidation
// predictable.  Keys follow a hierarchical tuple format:
//   ['scope', identifier?, filters?]

export const queryKeys = {
  // Public news
  news: {
    all: ['news'],
    list: (filters) => ['news', 'list', filters],
    detail: (slug) => ['news', 'detail', slug],
    breaking: () => ['news', 'breaking'],
    trending: () => ['news', 'trending'],
    latest: () => ['news', 'latest'],
    translations: (storyId) => ['news', 'translations', storyId],
  },

  // Categories
  categories: {
    all: ['categories'],
    detail: (slug) => ['categories', slug],
  },

  // Locations
  states: {
    all: ['states'],
    districts: (stateId) => ['states', stateId, 'districts'],
  },

  // Languages
  languages: {
    all: ['languages'],
  },

  // Search
  search: {
    results: (query, lang) => ['search', query, lang],
  },

  // Reader (Phase 6)
  reader: {
    bookmarks: () => ['reader', 'bookmarks'],
  },
}

