# GEMINI.md - Project Guide for AI Assistants

**CRITICAL : WHEN RUNNING GREP TOOL ALWAYS EXCLUDE THE NODE MODULES DIR
eg grep -R --exclude-dir=node_modules "processed event" -n .



This document provides a comprehensive overview of the `ledgerrocket-dashboard` project to enable effective collaboration and code modification by AI assistants.

## 1. Project Overview

* **Name:** `ledgerrocket-dashboard`
* **Purpose:** A React-based web application serving as a dashboard interface for the LedgerRocket Banking/Ledger API. It allows users to view and interact with core ledger concepts like Entities, Ledgers, Accounts, Transactions (via Templates/Events), and Reference Data.
* **Version:** 0.1.1 (as per `package.json`)
* **Core Functionality:** Displaying lists and details of financial entities, ledgers, and accounts; viewing balances; managing transaction templates; submitting events; viewing processed events and rules; browsing reference data (currencies, countries, account codes).

## 2. Technology Stack

* **Frontend Framework:** React (`react` v18.2.0)
* **Build Tool:** Create React App (`react-scripts` v5.0.1)
* **Routing:** React Router (`react-router-dom` v7.5.0) - *Note: Uses v7 API.*
* **UI Components:** NextUI (`@nextui-org/react` v2.6.11) - Provides core UI elements. Some custom components are also built.
* **Styling:** Tailwind CSS (`tailwindcss` v3.2.7) with PostCSS/Autoprefixer. Global styles in `index.css`, component-specific styles potentially within components or `App.css`.
* **HTTP Client:** Axios (`axios` v1.3.4) - Used within the `apiService` although the service primarily uses the native `fetch` API.
* **Icons:** Lucide React (`lucide-react` v0.488.0)
* **Charting:** Recharts (`recharts` v2.4.3) - Used in dashboard views for financial summaries.
* **State Management:**
  * React Hooks (`useState`, `useEffect`, `useCallback`, `useContext`)
  * React Context API (`src/context/DashboardContext.js`) for shared UI state (modal, filters, auto-refresh).
  * Custom Hooks (`src/hooks/`) for data fetching and business logic encapsulation.
* **Utilities:** `uuid` for generating unique IDs (e.g., for event forms).

## 3. Project Structure (`src` directory)

* **`App.js`:** Main application component, renders `LedgerDashboard`.
* **`components/`:** Contains all UI components, organized by feature/domain:
  * `accounts/`, `dashboard/`, `entities/`, `events/`, `ledgers/`, `processed-events/`, `reference/`, `rules/`, `templates/`: Feature-specific components (Lists, Details, Views).
  * `common/`: Highly reusable components (`DataTable`, `GenericListView`, `GenericDetailView`, `LoadingSpinner`, `ErrorAlert`, `ActionButton`, `config/modelConfig.js`).
  * `shared/`: Components shared across different features but not generic enough for `common` (e.g., `Sidebar`, `DetailModal`, `PageHeader`).
  * `dashboard/layout/`: Components defining the main dashboard structure (`DashboardLayout`, `DashboardHeader`, `DashboardFooter`).
* **`config/`:** Application configuration.
  * `api.js`: Defines API base URLs and endpoint paths.
* **`context/`:** React Context for global state management.
  * `DashboardContext.js`: Manages shared state like the detail modal, filters, and auto-refresh settings.
* **`hooks/`:** Custom React Hooks to encapsulate logic, especially data fetching.
  * `useDataFetching.js`: **Crucial generic hook** for fetching lists/details/children, handling loading/error states. Used by specific data hooks.
  * `useAccounts.js`, `useEntities.js`, `useLedgers.js`, `useTransactions.js`, `useDashboardData.js`, `useReferenceData.js`: Domain-specific hooks utilizing `useDataFetching` and `apiService`.
* **`services/`:** API interaction layer.
  * `apiService.js`: Centralizes all API calls using a `fetchWithErrorHandling` wrapper. Organizes API functions by resource (entity, ledger, account, etc.).
* **`utils/`:** Utility functions.
  * `formatters/`: Functions for formatting data for display (balances, dates, account codes, etc.).
  * `filterUtils/`: Functions for client-side filtering and searching.
  * `useInterval.js`: Hook for setting up intervals (used for auto-refresh).
* **`index.js`:** Application entry point, sets up React Router (`BrowserRouter`).
* **`index.css`, `App.css`:** Global and base styles.

## 4. Core Concepts & Patterns

* **Component-Based Architecture:** Standard React component structure.
* **Generic Components:** Heavy reliance on generic components (`GenericListView`, `GenericDetailView`, `DataTable`, `DataTableSection`) configured via props (especially `columns` and `sections`) to reduce boilerplate for displaying different data types.
* **Model Configuration:** `src/components/common/config/modelConfig.js` is **central** to the generic components. It defines titles, ID fields, list columns, and detail sections for each data model (Entity, Ledger, Account, Template, etc.), promoting consistency.
* **Hook-Based Data Fetching:** Data fetching logic is encapsulated in custom hooks (`src/hooks/`). The `useDataFetching` hook provides a reusable pattern for interacting with the `apiService`.
* **Centralized API Service:** All backend interactions go through `src/services/apiService.js`, which uses configuration from `src/config/api.js`.
* **Context for Shared UI State:** `DashboardContext` manages state relevant to the overall dashboard experience (e.g., the JSON detail modal) rather than specific data state.
* **Utility Functions:** Formatting and filtering logic are separated into `src/utils/`.
* **Routing:** `react-router-dom` v7 handles navigation. Routes are defined in `src/components/dashboard/DashboardRouter.js`. `useNavigate` and `useParams` are used for navigation and accessing URL parameters.
* **Layout Component:** `DashboardLayout` provides the consistent shell (Sidebar, Header, Footer) for all views using `<Outlet />`.

## 5. Key Data Models

The application primarily deals with the following data models (often fetched as "enriched" versions):

* **Entity:** Represents an owner (e.g., a company, individual).
* **Ledger:** A book of accounts, typically belonging to an Entity, usually in a specific currency.
* **Account:** Represents a store of value within a Ledger (e.g., Cash, Accounts Payable). Has a type (Asset, Liability, Equity, Revenue, Expense) and balance.
* **Currency:** Reference data for currency codes and properties (e.g., scale/decimal places).
* **Country:** Reference data for countries.
* **AccountCode:** Reference data defining standard account types/codes.
* **Template:** Defines the structure for a financial transaction/event.
* **Event:** An instance of a transaction submitted based on a Template.
* **ProcessedEvent:** The result of processing an Event, including generated transfers.
* **Rule:** Business logic rules applied during transaction processing.
* **Transfer:** A single movement of value between two accounts, generated from a ProcessedEvent.

*Configuration for displaying these models is found in `src/components/common/config/modelConfig.js`.*

## 6. Key Components & Their Roles

* **`DashboardLayout`:** Main application frame (Sidebar, Header, Footer).
* **`Sidebar`:** Navigation menu, collapsible.
* **`DashboardRouter`:** Defines application routes.
* **`GenericListView` / `StandardList` / `DataTable`:** Used to display lists of data (Entities, Ledgers, Accounts, etc.). Configured via `columns` prop.
* **`GenericDetailView` / `DetailCard`:** Used to display the details of a single item. Configured via `sections` and `childrenSections` props.
* **`DataTableSection`:** Renders tables within detail views (e.g., accounts within a ledger detail).
* **`EventForm`:** Form for submitting new events based on a selected template.
* **`DetailModal`:** Modal dialog used across the app to show the raw JSON of any data item. Triggered via `handleViewJson` from `DashboardContext`.
* **`modelConfig.js`:** Not a component, but crucial configuration driving the generic list/detail views.

## 7. Data Flow

1. **User Interaction/Navigation:** User navigates via the `Sidebar` (React Router updates URL).
2. **Component Mount:** The relevant list or detail component mounts (e.g., `AccountList`, `AccountDetail`).
3. **Hook Execution:** The corresponding data hook (e.g., `useAccounts`) is called.
4. **API Call:** The hook uses `apiService` to make a request to the backend API (endpoints defined in `config/api.js`). `useDataFetching` often handles the actual call and state updates (loading, error, data).
5. **State Update:** The hook updates its state (e.g., `accounts`, `selectedAccount`, `loading`).
6. **Re-render:** The component re-renders with the new data or loading/error state.
7. **Display:** Generic components (`GenericListView`, `GenericDetailView`) render the data based on props and `modelConfig.js`. Formatters (`src/utils/formatters/`) are used to display data nicely.
8. **Shared State:** `DashboardContext` provides access to shared UI state like the detail modal (`handleViewJson`).

## 8. How to Work with the Code (Common Tasks)

* **Adding a New View (List/Detail):**
    1. Define API calls in `apiService.js`.
    2. Create a new custom hook in `src/hooks/` using `useDataFetching` and the new API calls.
    3. Add model configuration to `src/components/common/config/modelConfig.js` (list columns, detail sections).
    4. Create List and Detail components in `src/components/your_feature/` using `GenericListView` and `GenericDetailView`, passing the hook's data and the model config.
    5. Add routes in `src/components/dashboard/DashboardRouter.js`.
    6. Add navigation link in `src/components/shared/sidebar/Sidebar.js`.
* **Modifying Data Display:**
  * For lists: Update the `listColumns` definition in `modelConfig.js`.
  * For details: Update the `detailSections` definition in `modelConfig.js`.
  * Add/modify formatters in `src/utils/formatters/` if needed.
* **Changing API Endpoints:** Modify `src/config/api.js`.
* **Adding a Filter:**
  * Update the relevant hook in `src/hooks/` to manage filter state.
  * Modify the API call in the hook or `apiService` if backend filtering is needed, OR
  * Apply client-side filtering using functions from `src/utils/filterUtils/` within the hook or component *before* passing data to `GenericListView`.
  * Update UI components to allow setting the filter (e.g., dropdowns, buttons).
* **Styling Changes:** Modify Tailwind classes directly in components or update base styles in `index.css`.

## 9. Potential Areas for Attention

* **Error Handling:** While `fetchWithErrorHandling` exists, ensure errors are gracefully handled and displayed to the user in all scenarios. The global `ErrorAlert` is a good pattern.
* **Loading States:** Ensure appropriate loading indicators are shown for all data fetching operations, especially within detail views when child data loads.
* **Performance:** For very large datasets, client-side filtering/sorting in `GenericListView`/`StandardList` might become slow. Consider server-side pagination, filtering, and sorting if needed. `useMemo` and `useCallback` can be used for optimization.
* **Testing:** No test files are visible in the structure. Adding unit and integration tests would improve robustness.
* **State Management Complexity:** If shared state grows beyond UI concerns, consider more robust state management libraries (like Redux Toolkit, Zustand) – though the current hook-based approach seems appropriate for the scale shown.
* **Code Duplication:** The generic components and hooks significantly reduce duplication, but review feature-specific components for any remaining redundancy.
* **NextUI Integration:** Ensure consistent use of NextUI components where appropriate.

## 10. Important Files for Understanding Architecture

* `src/components/dashboard/DashboardRouter.js` (Routing)
* `src/components/dashboard/layout/DashboardLayout.js` (Overall Structure)
* `src/hooks/useDataFetching.js` (Core Data Fetching Logic)
* `src/services/apiService.js` (API Interaction Layer)
* `src/config/api.js` (API Endpoints)
* `src/context/DashboardContext.js` (Shared UI State)
* `src/components/common/config/modelConfig.js` (Model Display Configuration)
* `src/components/common/GenericListView.js` & `GenericDetailView.js` (Reusable View Patterns)
CL