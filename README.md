# LedgerRocket Dashboard

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2.7-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A web-based dashboard application built with React for visualizing and interacting with the LedgerRocket Ledger and Transactions APIs. It provides views for managing entities, ledgers, accounts, templates, events, and rules, along with a financial overview (Balance Sheet).

## Key Features

* **Financial Overview:** Displays a summary Balance Sheet and Income Statement based on account data.
* **Entity Management:** List and view details of Entities, including their associated Ledgers and Accounts.
* **Ledger Management:** List and view details of Ledgers, including their associated Accounts and owner Entity.
* **Account Management:** List, filter (by type), and view details of Accounts, including balances and associated Ledger/Entity.
* **Transaction Engine Interaction:**
  * View and use transaction **Templates**.
  * Submit new **Events** based on templates via an Event Entry form.
  * List and view details of **Processed Events**.
  * List and view details of transaction **Rules**.
* **Reference Data:** View lists of Currencies, Countries, and Account Codes used within the system.
* **Data Visualization:** Basic JSON data viewer modal for inspecting raw API responses.
* **Auto-Refresh:** Option to automatically refresh account balances periodically.

## Tech Stack

* **Frontend Framework:** [React](https://reactjs.org/) (v18.2.0) using `react-scripts` (Create React App)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v3.2.7) with PostCSS and Autoprefixer
* **State Management:**
  * React Context API (`src/context/DashboardContext.js`) for global UI state (active view, selections, modal state, etc.).
  * Custom React Hooks (`src/hooks/*`) encapsulating data fetching, state, and logic for specific features (e.g., `useAccounts`, `useEntities`, `useDataFetching`).
* **API Interaction:** Browser `fetch` API wrapped in a dedicated service (`src/services/apiService.js`).
* **Language:** JavaScript

## Project Structure

The project follows a feature-based structure within `src/components`:

```tree
.
├── public/                  # Static assets and index.html
├── src/
│   ├── App.js               # Main application component
│   ├── components/          # UI components
│   │   ├── accounts/        # Account related components
│   │   ├── common/          # Generic, reusable UI components (DataTable, DetailCard, etc.)
│   │   ├── dashboard/       # Dashboard overview and layout components
│   │   ├── entities/        # Entity related components
│   │   ├── events/          # Event Entry components
│   │   ├── ledgers/         # Ledger related components
│   │   ├── processed-events/ # Processed Event components
│   │   ├── reference/       # Reference data list components
│   │   ├── rules/           # Rule related components
│   │   ├── shared/          # Shared components (Sidebar, Modals)
│   │   └── templates/       # Template related components
│   ├── config/              # API endpoint configuration
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React Hooks for logic and state
│   ├── services/            # API interaction layer
│   ├── utils/               # Utility functions (formatters, filters)
│   ├── index.css            # Global styles / Tailwind base
│   └── index.js             # Application entry point
├── tailwind.config.js       # Tailwind configuration
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

## Getting Started

### Prerequisites

* Node.js (v16 or later recommended)
* npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ledgerrocket-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

2. Open your browser and navigate to `http://localhost:3000` (or the port specified in the output).

### Building for Production

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `build/` directory.

### Running Tests

```bash
npm test
# or
yarn test
```

(Note: Test files were not found in the provided code structure, but the command exists)

## API Endpoints

The application interacts with two primary APIs:

* **Ledger API:** `https://ledger.dev.ledgerrocket.com` (Handles Entities, Ledgers, Accounts, Reference Data)
* **Transactions API:** `https://transactions.dev.ledgerrocket.com` (Handles Templates, Events, Rules)

Configuration is located in `src/config/api.js`.

## State Management

State is managed using a combination of:

* **React Context API:** `DashboardContext` (`src/context/DashboardContext.js`) holds global UI state like the currently selected view/tab, IDs of selected items for detail views (before router implementation), modal visibility, auto-refresh settings, and sidebar state.
* **Custom Hooks:** Hooks like `useAccounts`, `useEntities`, `useLedgers`, `useTransactions`, `useReferenceData` encapsulate fetching data from the API, managing the data state (lists, selected items, children), and handling loading/error states for their respective features. They often utilize the generic `useDataFetching` hook (`src/hooks/useDataFetching.js`) for common fetch patterns.
* **Local Component State:** `useState` is used within components for managing local UI concerns like form inputs or temporary view states.

## Styling

Styling is handled exclusively via Tailwind CSS. Utility classes are applied directly in the JSX. Configuration can be found in `tailwind.config.js` and `postcss.config.js`. Global base styles and Tailwind directives are in `src/index.css`.

## Future Improvements / Roadmap

(Based on previous code review)

* Implement Client-Side Routing: Replace context-based navigation with react-router-dom for deep linking and browser history support.
* Add Automated Tests: Implement unit and integration tests using React Testing Library and Jest.
* Refactor Large Components: Break down complex components like EventForm into smaller, more manageable units.
* Enhance Error Handling: Implement global error boundaries and potentially more user-friendly error feedback.
* (Optional) Migrate build tool from react-scripts to Vite for potential performance improvements.
* (Optional) Convert codebase to TypeScript for enhanced type safety.
*
