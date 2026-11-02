// ── User Roles ────────────────────────────────────────────────────────────────
// These map to role.name values in the database.
// Used for display, seeding, and frontend permission checks (server enforces authz).

/** @enum {string} */
export const ROLES = Object.freeze({
  SUPER_ADMIN:          'super_admin',
  MANAGING_EDITOR:      'managing_editor',
  NATIONAL_EDITOR:      'national_editor',
  STATE_BUREAU_CHIEF:   'state_bureau_chief',
  DISTRICT_REPORTER:    'district_reporter',
  JOURNALIST:           'journalist',
  COPY_EDITOR:          'copy_editor',
  LANGUAGE_EDITOR:      'language_editor',
  VIDEO_EDITOR:         'video_editor',
  SOCIAL_MEDIA_MANAGER: 'social_media_manager',
  AD_MANAGER:           'ad_manager',
  AUDITOR:              'auditor',
  READER:               'reader',
})

/** Roles that have access to the Admin CMS */
export const ADMIN_ROLES = Object.freeze([
  ROLES.SUPER_ADMIN,
  ROLES.MANAGING_EDITOR,
  ROLES.NATIONAL_EDITOR,
  ROLES.STATE_BUREAU_CHIEF,
  ROLES.DISTRICT_REPORTER,
  ROLES.JOURNALIST,
  ROLES.COPY_EDITOR,
  ROLES.LANGUAGE_EDITOR,
  ROLES.VIDEO_EDITOR,
  ROLES.SOCIAL_MEDIA_MANAGER,
  ROLES.AD_MANAGER,
  ROLES.AUDITOR,
])

/** Human-readable labels for UI display */
export const ROLE_LABELS = Object.freeze({
  [ROLES.SUPER_ADMIN]:          'Super Admin',
  [ROLES.MANAGING_EDITOR]:      'Managing Editor',
  [ROLES.NATIONAL_EDITOR]:      'National Editor',
  [ROLES.STATE_BUREAU_CHIEF]:   'State Bureau Chief',
  [ROLES.DISTRICT_REPORTER]:    'District Reporter',
  [ROLES.JOURNALIST]:           'Journalist / Reporter',
  [ROLES.COPY_EDITOR]:          'Copy Editor',
  [ROLES.LANGUAGE_EDITOR]:      'Language Editor / Translator',
  [ROLES.VIDEO_EDITOR]:         'Video Editor',
  [ROLES.SOCIAL_MEDIA_MANAGER]: 'Social Media Manager',
  [ROLES.AD_MANAGER]:           'Advertisement Manager',
  [ROLES.AUDITOR]:              'Auditor',
  [ROLES.READER]:               'Reader / Subscriber',
})

// ── Permission codes ──────────────────────────────────────────────────────────
// Server enforces these.  Frontend uses them only for UI hints.

/** @enum {string} */
export const PERMISSIONS = Object.freeze({
  // Articles
  ARTICLE_CREATE:    'article:create',
  ARTICLE_EDIT:      'article:edit',
  ARTICLE_SUBMIT:    'article:submit',
  ARTICLE_REVIEW:    'article:review',
  ARTICLE_APPROVE:   'article:approve',
  ARTICLE_PUBLISH:   'article:publish',
  ARTICLE_SCHEDULE:  'article:schedule',
  ARTICLE_RETRACT:   'article:retract',

  // Editorial
  EDITORIAL_ASSIGN:      'editorial:assign',
  EDITORIAL_FACT_CHECK:  'editorial:fact_check',
  EDITORIAL_COMMENT:     'editorial:comment',

  // Translations
  TRANSLATION_ASSIGN:   'translation:assign',
  TRANSLATION_SUBMIT:   'translation:submit',
  TRANSLATION_APPROVE:  'translation:approve',

  // Media
  MEDIA_UPLOAD: 'media:upload',
  MEDIA_DELETE: 'media:delete',

  // Users
  USER_MANAGE:     'user:manage',
  USER_VIEW:       'user:view',
  USER_DEACTIVATE: 'user:deactivate',

  // Roles
  ROLE_MANAGE: 'role:manage',

  // Advertisements
  AD_MANAGE:       'ad:manage',
  AD_VIEW_REPORTS: 'ad:view_reports',

  // Analytics
  ANALYTICS_VIEW:   'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // Audit
  AUDIT_VIEW: 'audit:view',

  // System
  SYSTEM_CONFIGURE: 'system:configure',
})

