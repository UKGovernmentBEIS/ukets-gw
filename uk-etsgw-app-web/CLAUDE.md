# CLAUDE.md

This file provides guidance to AI agents when working with code in this repository.

## What This Is

UK ETS Gateway (ETSGW) web frontend — an Angular 17 application for the UK Emissions Trading Scheme. It serves as the entry point that authenticates users against multiple Keycloak realms (ETSGW, PMRV, MRTM) and routes them to the appropriate downstream service.

## Build & Dev Commands

```bash
yarn install                  # Install dependencies (runs postinstall: git-version + prebuild)
yarn start                    # Dev server at http://localhost:4199 (proxies /api to localhost:8078)
yarn build                    # Production build (prebuild runs automatically)
yarn lint                     # ESLint (ng lint)
```

**Tests (Jest, not Karma):**
```bash
yarn test:frontend            # Run all app tests
yarn test:frontend -- --testPathPattern=dashboard  # Run tests matching a pattern
yarn test:frontend:watch      # Watch mode
yarn test:frontend:coverage   # With coverage
```

**Library builds (must build before app tests or dev server):**
```bash
yarn build:govuk-components   # Build the GOV.UK component library
yarn build:etsgw-api          # Build the generated API client
yarn prebuild                 # Both of the above
```

**API client regeneration from OpenAPI spec:**
```bash
yarn generate:api             # Regenerate from projects/etsgw-api/src/assets/swagger.yaml
```

## Architecture

### Multi-Project Workspace

Three Angular projects in one workspace (`angular.json`):

- **uk-etsgw-app-web** (application) — the main app in `src/`. Component prefix: `etsgw`.
- **govuk-components** (library) — reusable GOV.UK Design System components in `projects/govuk-components/`. Component prefix: `govuk`. Uses `OnPush` change detection and inline templates by default.
- **etsgw-api** (library) — auto-generated TypeScript Angular API client in `projects/etsgw-api/`. Generated from OpenAPI spec via `openapi-generator-cli` with `typescript-angular` generator. Base path: `/api`.

Libraries are consumed via path aliases: `@etsgw/govuk-components`, `@etsgw/api`.

### Path Aliases

Defined in `tsconfig.json`, also mirrored in `jest.config.js` moduleNameMapper:
- `@etsgw/govuk-components` -> `dist/govuk-components`
- `@etsgw/api` -> `dist/etsgw-api`
- `@etsgw/common/*` -> `src/app/common/*`
- `@etsgw/core/*` -> `src/app/core/*`

### State Management

Custom signal-based store (`src/app/core/store/signal-store.ts`), not NgRx. Uses `createSelector` / `createDescendingSelector` / `createAggregateSelector` for computed state. Immutable updates via **immer** `produce()`. There is also a legacy `Store<T>` class extending `BehaviorSubject` in `src/app/core/store/store.ts`.

### Authentication

Uses `keycloak-js 26` directly (no `keycloak-angular` wrapper). Three `Keycloak` instances injected via tokens (`ETSGW_KEYCLOAK`, `PMRV_KEYCLOAK`, `MRTM_KEYCLOAK` in `auth.config.ts`). All connect to the `uk-pmrv` realm with different client IDs. The ETSGW client uses `check-sso` on load; others initialize silently. Keycloak server URL is fetched at runtime from the backend config endpoint.

Local utilities in `src/app/core/auth/keycloak/` replace what `keycloak-angular` previously provided:
- `keycloak-event.ts` — `KeycloakEventType` enum, `KEYCLOAK_EVENT_SIGNAL` injection token, `createKeycloakSignal()` (wires Keycloak callbacks to an Angular `WritableSignal`)
- `bearer-token.interceptor.ts` — `HttpInterceptorFn` that attaches bearer tokens for the ETSGW instance

### Routing

Standalone components with functional route guards (`authGuard`, `nonAuthGuard`). Authenticated users go to `/dashboard`; unauthenticated to `/landing`. Static pages (privacy-notice, contact-us, accessibility, legislation) are unguarded.

## Code Conventions

- **Standalone components** — all components use `standalone: true`
- **Component selectors** — prefix `etsgw-` (kebab-case elements/attributes)
- **Directive selectors** — prefix `etsgw` (camelCase attributes)
- **Import ordering** — enforced by `eslint-plugin-simple-import-sort`: Angular -> RxJS -> other -> govuk-components -> etsgw-api -> src -> relative
- **Formatting** — Prettier: 120 char width, single quotes, trailing commas, 2-space indent
- **Styling** — SCSS with GOV.UK Frontend; custom theme partials in `src/theming/`

## Testing Patterns

- **Jest** with `jest-preset-angular` — not Karma/Jasmine
- **Testing Library** (`@testing-library/angular`) is available and preferred for component tests
- Test helpers in `src/app/common/testing/`: `mockClass()` auto-mocks a class, `injectMock()` retrieves a mocked injectable
- govuk-components tests use a separate Jest config at `projects/govuk-components/jest.config.js`

## Deployment

Containerized via nginx:1.30 (`Dockerfile`). The Angular build output is served as static files with `try_files` fallback to `index.html` for SPA routing. Nginx config in `.nginx/nginx.conf`.
