// ── Article publication status ─────────────────────────────────────────────
// These values map to the article.status ENUM in the database.
// Order reflects the editorial lifecycle.

/** @enum {string} */
export const ARTICLE_STATUS = Object.freeze({
  // Authoring
  DRAFT:              'DRAFT',

  // Editorial flow
  SUBMITTED:          'SUBMITTED',
  IN_REVIEW:          'IN_REVIEW',
  FACT_CHECK:         'FACT_CHECK',
  APPROVED:           'APPROVED',

  // Publication
  SCHEDULED:          'SCHEDULED',
  PUBLISHED:          'PUBLISHED',

  // Post-publication
  CORRECTION:         'CORRECTION',  // Status stays PUBLISHED; version created
  RETRACTED:          'RETRACTED',

  // Translation flow
  TRANSLATION_ASSIGNED:    'TRANSLATION_ASSIGNED',
  TRANSLATION_IN_PROGRESS: 'TRANSLATION_IN_PROGRESS',
  TRANSLATION_SUBMITTED:   'TRANSLATION_SUBMITTED',
  TRANSLATION_APPROVED:    'TRANSLATION_APPROVED',
})

/** Valid status transitions (from → [allowed to]) */
export const ARTICLE_STATUS_TRANSITIONS = Object.freeze({
  [ARTICLE_STATUS.DRAFT]:                   [ARTICLE_STATUS.SUBMITTED],
  [ARTICLE_STATUS.SUBMITTED]:               [ARTICLE_STATUS.IN_REVIEW, ARTICLE_STATUS.DRAFT],
  [ARTICLE_STATUS.IN_REVIEW]:               [ARTICLE_STATUS.DRAFT, ARTICLE_STATUS.FACT_CHECK, ARTICLE_STATUS.APPROVED],
  [ARTICLE_STATUS.FACT_CHECK]:              [ARTICLE_STATUS.APPROVED, ARTICLE_STATUS.IN_REVIEW],
  [ARTICLE_STATUS.APPROVED]:                [ARTICLE_STATUS.PUBLISHED, ARTICLE_STATUS.SCHEDULED],
  [ARTICLE_STATUS.SCHEDULED]:               [ARTICLE_STATUS.PUBLISHED, ARTICLE_STATUS.APPROVED],
  [ARTICLE_STATUS.PUBLISHED]:               [ARTICLE_STATUS.RETRACTED],  // Correction creates a version; status stays PUBLISHED
  [ARTICLE_STATUS.RETRACTED]:               [],
  [ARTICLE_STATUS.TRANSLATION_ASSIGNED]:    [ARTICLE_STATUS.TRANSLATION_IN_PROGRESS],
  [ARTICLE_STATUS.TRANSLATION_IN_PROGRESS]: [ARTICLE_STATUS.TRANSLATION_SUBMITTED],
  [ARTICLE_STATUS.TRANSLATION_SUBMITTED]:   [ARTICLE_STATUS.TRANSLATION_APPROVED, ARTICLE_STATUS.TRANSLATION_IN_PROGRESS],
  [ARTICLE_STATUS.TRANSLATION_APPROVED]:    [ARTICLE_STATUS.PUBLISHED],
})

/** Status badge colours for UI display */
export const ARTICLE_STATUS_COLOR = Object.freeze({
  [ARTICLE_STATUS.DRAFT]:                   'gray',
  [ARTICLE_STATUS.SUBMITTED]:               'blue',
  [ARTICLE_STATUS.IN_REVIEW]:               'yellow',
  [ARTICLE_STATUS.FACT_CHECK]:              'orange',
  [ARTICLE_STATUS.APPROVED]:                'teal',
  [ARTICLE_STATUS.SCHEDULED]:               'purple',
  [ARTICLE_STATUS.PUBLISHED]:               'green',
  [ARTICLE_STATUS.CORRECTION]:              'amber',
  [ARTICLE_STATUS.RETRACTED]:               'red',
  [ARTICLE_STATUS.TRANSLATION_ASSIGNED]:    'sky',
  [ARTICLE_STATUS.TRANSLATION_IN_PROGRESS]: 'indigo',
  [ARTICLE_STATUS.TRANSLATION_SUBMITTED]:   'violet',
  [ARTICLE_STATUS.TRANSLATION_APPROVED]:    'emerald',
})

// ── Story status ───────────────────────────────────────────────────────────
/** @enum {string} */
export const STORY_STATUS = Object.freeze({
  ACTIVE:   'active',
  ARCHIVED: 'archived',
})

// ── Scope types ────────────────────────────────────────────────────────────
/** @enum {string} */
export const SCOPE_TYPE = Object.freeze({
  GLOBAL:   'global',
  STATE:    'state',
  DISTRICT: 'district',
  CATEGORY: 'category',
  LANGUAGE: 'language',
})

// ── Change reason (article versions) ──────────────────────────────────────
/** @enum {string} */
export const CHANGE_REASON = Object.freeze({
  EDIT:       'edit',
  CORRECTION: 'correction',
  RETRACTION: 'retraction',
})

