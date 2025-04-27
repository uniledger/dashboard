# INSTRUCTIONS.md

**CRITICAL : WHEN RUNNING GREP TOOL ALWAYS EXCLUDE THE NODE MODULES DIR
eg grep -R --exclude-dir=node_modules "processed event" -n .

DO NOT 'FALL BACK' ONTO OTHER VARIABLE NAMES... UNDERSTAND THE DATA AND USE THE CORRECT NAME.  NEVER IMPLEMENT A 'FALL BACK' THING.. EVER


JUST FIX WHAT YOU WERE ASKED TO DO. IF YOU FIND OTHER THINGS THEN ASK THE USER.  DONT JUST GO AROUND CHANGING STUFF
NEVER EVER EVER CHANGE THINGS OUT OF SCOPE OF THE INSTRUCTION U WERE GIVEN
 This file consolidates project context, guidelines, and key information for AI assistants and developers.

## 1. Build & Dev Commands

- `npm start`       : Run dev server (localhost:3000)
- `npm build`       : Create production build
- `npm test`        : Run all tests
- `npm test -- --testPathPattern=ComponentName` : Run specific test

## 2. Lint & Format

- ESLint with `react-app` preset
- 2-space indentation
- Run `npm run lint` before committing

## 3. Code Style

- React functional components with hooks
- JSDoc comments for functions/components
- Config-driven architecture (see `modelConfig.js`)
- Destructure props with defaults, use early returns for conditional rendering

## 4. Naming & Organization

- Components: PascalCase (e.g., `GenericDetailView.js`)
- Hooks, utils, variables: camelCase (e.g., `useDataFetching`)
- File structure by feature/domain (e.g., `accounts/`, `ledgers/`)

## 5. Data & Error Handling

- Data fetching via custom hooks (`useDataFetching`, domain hooks)
- `apiService` + `fetchWithErrorHandling`
- try/catch in hooks, show user-friendly errors via `ErrorAlert`
- Loading states with `LoadingSpinner`

## 6. Project Overview

- Name       : `ledgerrocket-dashboard`
- Version    : 0.1.1
- Purpose    : React dashboard for LedgerRocket Banking/Ledger API
- Core views : Entities, Ledgers, Accounts, Templates, Events, ProcessedEvents, Rules, Reference Data

## 7. Tech Stack

- React v18, Create React App
- React Router v7
- NextUI (UI components)
- Tailwind CSS + PostCSS
- Axios / native fetch
- Lucide React (icons)
- Recharts (charts)
- React Context API & custom hooks for state
- `uuid` for IDs

## 8. High-Level Structure

 ```
 src/
 ├── components/       # feature and common UI components
 ├── config/           # API URLs and paths
 ├── context/          # DashboardContext for shared UI state
 ├── hooks/            # useDataFetching + domain hooks
 ├── services/         # apiService.js
 ├── utils/            # formatters, filters, useInterval
 ├── index.js, App.js, index.css, App.css
 ```

## 9. Core Concepts & Patterns

- Generic list/detail views (`GenericListView`, `GenericDetailView`) configured via `modelConfig.js`
- Model configuration drives columns, sections, titles
- Hook-based data fetching abstracts loading/error/data
- Centralized API service layer (`apiService.js`)
- Context for UI state (modals, filters, auto-refresh)

## 10. Key Data Models

- Entity, Ledger, Account, Currency, Country, AccountCode
- Template, Event, ProcessedEvent, Rule, Transfer

## 11. Key Components & Roles

- `DashboardLayout` / `Sidebar` / `DashboardRouter`
- `GenericListView` / `DataTable` for lists
- `GenericDetailView` / `DetailCard` for details
- `DataTableSection` for nested tables
- `EventForm` for submitting transactions
- `DetailModal` for raw JSON view

## 12. Data Flow

 1. User navigates via Sidebar (React Router)
 2. List/detail component mounts
 3. Domain hook invokes `useDataFetching` + `apiService`
 4. State updates (loading/data/error)
 5. Generic components render using `modelConfig` + formatters
 6. Shared UI actions via `DashboardContext`

## 13. Common Tasks

- **Add new view:**
   1. API in `apiService.js`
   2. Hook in `hooks/` using `useDataFetching`
   3. Model config update in `modelConfig.js`
   4. List/detail components using generic views
   5. Route in `DashboardRouter.js`
   6. Sidebar link in `Sidebar.js`
- **Modify display:** update `listColumns` or `detailSections`
- **Change endpoints:** edit `config/api.js`
- **Add filter:** update hook or use `filterUtils`, adjust UI
- **Styling:** Tailwind classes or global CSS

## 14. Areas for Attention

- Ensure robust error handling & user-facing messages
- Show loading states consistently
- Consider performance for large datasets (memoize, server-side pagination)
- Add tests where missing
- Monitor shared state growth; refactor if needed
- Avoid code duplication; leverage generic components
- Maintain NextUI consistency

## 15. Important Files

 - `src/components/LedgerDashboard.js`
 - `src/components/dashboard/DashboardRouter.js`
 - `src/components/dashboard/DashboardView.js`
 - `src/components/dashboard/layout/DashboardLayout.js`
 - `src/hooks/useDataFetching.js`
 - `src/services/apiService.js`
 - `src/config/api.js`
 - `src/context/DashboardContext.js`
 - `src/components/common/config/modelConfig.js`
 - `src/components/common/GenericListView.js`
 - `src/components/common/GenericDetailView.js`

 *Use this file as a single source of truth for project conventions and architecture.*
