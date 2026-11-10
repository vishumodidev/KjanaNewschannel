# JANA NEWS NETWORK
## Complete Architecture, Development & Production Readiness Playbook
### Multilingual News Publishing Platform • Public Website • Newsroom CMS • REST API • MySQL

| Document control | Value |
|---|---|
| **Purpose** | Single execution guide for completing the JANA NEWS NETWORK content-management news website. |
| **Baseline status** | Phase 0 and Phase 1 are reported complete by the project team; Phase 2 is next. |
| **Technology baseline** | React + Vite, Node.js + Express, MySQL 8 + Prisma, npm workspaces; confirm exact versions in repository. |
| **Primary language** | Kannada first; English and Hindi enabled in the initial language seed. |
| **Delivery approach** | Modular monolith, phased implementation, test gates, documented decisions, controlled releases. |
| **Audience** | Product owner, architect, frontend/backend engineers, database engineer, QA, DevOps and newsroom stakeholders. |

---

## 1. Executive Direction
Build **JANA NEWS NETWORK** as a secure, multilingual digital publishing platform—not merely a news homepage. The system consists of a public reader experience, an authenticated newsroom/admin CMS, a versioned REST API, a relational MySQL database, media storage, publishing workflows, analytics, and production operations.

The current project update states that Phase 0 (architecture, ER modelling and multilingual blueprint) and Phase 1 (monorepo foundation, UI mockups, branding, mobile navigation and Git initialization) are complete. Treat those as reported status, not independently verified facts. Before Phase 2, inspect the repository and run baseline builds so the team knows exactly what is working.

| Principle | Required practice |
|---|---|
| **Editorial integrity** | Every article has an owner, status, revision history, publication time and audit trail. |
| **Language correctness** | One news event/story can have independent language-specific article versions. |
| **Least privilege** | Access is checked on the server for role, action, language and geographic scope. |
| **Reliable publishing** | Publishing is transactional, idempotent where needed, observable and recoverable. |
| **Performance** | Public pages are cacheable; media is optimized; database queries are indexed and measured. |
| **Maintainability** | Modular boundaries, API contracts, migrations, automated tests and decision records. |
| **Operational readiness** | Backups, restore drills, monitoring, alerts, runbooks and rollback are mandatory. |

---

## 2. Product Scope and System Boundaries

### 2.1 Applications
- **Public website**: homepage, article detail, category pages, state/district pages, search, trending/latest, video, photo galleries, static pages and reader features if approved.
- **Admin/newsroom CMS**: dashboard, staff/users, roles, permissions, geographic assignments, story/article editing, editorial queues, translations, media, ads, analytics, audit logs and settings.
- **Backend API**: authentication, authorization, content, taxonomy, editorial workflow, translation, media, advertising, analytics and administration endpoints.
- **Infrastructure**: MySQL, media object storage or local development storage, cache/queue where justified, reverse proxy, CI/CD, logs, backups and monitoring.

### 2.2 Explicit Non-Goals for the Initial Release
- Do not split into microservices at the start. Use a modular monolith until scale or team ownership justifies extraction.
- Do not add AI-generated publishing, automatic translation publishing, live streaming, native mobile apps or complex personalization unless separately approved.
- Do not scrape or republish third-party content without documented rights and editorial approval.
- Do not treat mock headlines, sample analytics or demo weather data as real live information.

---

## 3. Target Architecture

| Layer | Responsibility | Implementation guidance |
|---|---|---|
| **Public web** | Reader-facing pages and SEO | Existing React/Vite baseline; decide SSR/prerender strategy before SEO integration. Keep data access behind API client/hooks. |
| **Admin web** | Newsroom operations | Separate React app; permission-aware UI; forms, tables, queues and rich-text editor. |
| **API** | Business rules and integration boundary | Express REST API `/api/v1`; controllers remain thin; services enforce use cases; repositories isolate Prisma queries. |
| **Domain modules** | Content and newsroom capabilities | Auth, users, RBAC, scopes, taxonomy, stories, articles, workflow, translations, media, ads, analytics, notifications. |
| **Database** | Transactional source of truth | MySQL 8 + Prisma; migrations committed to Git; relational integrity and indexes. |
| **Media** | Original and derived assets | Storage abstraction; S3-compatible object storage in production; local adapter for development; WebP/AVIF derivatives. |
| **Background work** | Slow/retryable jobs | Introduce a durable queue only when needed for image processing, scheduled publishing, email and analytics aggregation. |
| **Edge/operations** | TLS, routing, caching and deployment | Nginx or managed ingress; Docker; health checks; logs, metrics, backups and release runbooks. |

---

## 4. Repository Structure and Module Conventions

```
diginews-network/
  apps/
    web/                 # Public reader website
    admin/               # Newsroom and CMS
  server/
    prisma/              # schema, migrations, seed
    src/
      config/            # validated environment/configuration
      modules/           # domain modules
      middleware/        # auth, RBAC, scope, validation, errors
      routes/            # API route registration
      utils/ errors/ validators/
    tests/
  packages/
    shared/              # safe shared utilities/types/constants
    api-contracts/       # request/response schemas and contracts
  docs/
    architecture/ database/ api/ security/ testing/ deployment/ runbooks/
  scripts/
  docker-compose.yml
  package.json
```

---

## 5. Domain Model and Critical Modelling Rules
1. A **story** is the underlying event/topic. An **article** is a language-specific editorial publication. One story may have Kannada, English and Hindi articles.
2. Each language article has its own headline, slug, summary, body, SEO metadata, author/editor, status and publication timestamps.
3. Use a unique constraint for the public slug within the language/site scope.
4. Keep `created_at`, `updated_at`, `submitted_at`, `approved_at`, `published_at`, and `scheduled_at` semantically distinct. Store timestamps in UTC.
5. Use database transactions for multi-record publishing, role changes, and workflow transitions.
6. Avoid storing core relational facts in unvalidated JSON columns.

---

## 6. Roles, Permissions and Geographic Scope
- **13 Roles**: Super Admin, Managing Editor, National Editor, State Bureau Chief, District Reporter, Journalist / Reporter, Copy Editor, Language Editor / Translator, Video Editor, Social Media Manager, Advertisement Manager, Auditor, Reader / Subscriber.
- **Permission Matrix**: `role × resource × action × scope`.
- **Geographic Scope**: Evaluated server-side on every query and mutation.

---

## 7. Editorial and Translation Lifecycle
`DRAFT → SUBMITTED → IN_REVIEW → FACT_CHECK → APPROVED → SCHEDULED / PUBLISHED`
- Add revision requests and rejection reasons.
- Translation assignments are managed independently for each language.
- Concurrency control via optimistic locking / version checks.

---

## 8. Definition of Done (Every Task)
1. Requirement and acceptance criteria clear.
2. UI handles loading, empty, success, validation, permission-denied, and server-error states.
3. Backend validates inputs and enforces authentication, permissions, and scope.
4. Database changes use reviewed Prisma migrations.
5. Unit and integration tests cover normal, boundary, and unauthorized cases.
6. Documentation and OpenAPI contracts updated.
7. Build, lint, and relevant tests executed and passing.
