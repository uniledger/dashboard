# LedgerRocket Banking Dashboard

A web-based dashboard for the LedgerRocket Banking API that provides visualizations and management of accounts, ledgers, and financial data.

## Features

- **Entity Management**: View and manage banking entities with their relationships
- **Ledger Overview**: Explore different ledgers with associated currencies and entities
- **Account Management**: Browse and manage accounts across entities and ledgers
- **Financial Analytics**: Visual representations of financial data and account balances
- **JSON Data Inspection**: View complete JSON data for any record

## Project Structure

```
src/
├─ components/
│   ├─ accounts/
│   │   └─ AccountList.js      # Displays all accounts across the system
│   ├─ analytics/
│   │   └─ AnalyticsView.js    # Charts and analytics visualizations
│   ├─ dashboard/
│   │   └─ DashboardView.js    # Main dashboard summary view
│   ├─ entities/
│   │   ├─ EntityDetail.js     # Detailed view of a single entity
│   │   └─ EntityList.js       # List of all entities
│   ├─ ledgers/
│   │   ├─ LedgerDetail.js     # Detailed view of a single ledger
│   │   └─ LedgerList.js       # List of all ledgers
│   ├─ shared/
│   │   ├─ DetailModal.js      # JSON data modal component
│   │   └─ PageHeader.js       # Common page header component
│   └─ LedgerDashboard.js      # Main container component
├─ App.js                      # Application entry point
└─ index.js                    # React entry point
```

## API Integration

The dashboard integrates with the LedgerRocket API, specifically:

- `/api/v1/enriched-accounts/` - Retrieves all account data
- `/api/v1/enriched-ledgers/` - Retrieves all ledger data
- `/api/v1/enriched-ledgers/{id}/accounts/` - Retrieves accounts for a specific ledger

## Technology Stack

- React
- Tailwind CSS
- Recharts for data visualization

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/uniledger/dashboard.git
cd dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Deployment

This project is automatically deployed to AWS S3 when changes are pushed to the main branch. The GitHub Actions workflow handles building the application and deploying it to the S3 bucket.

The dashboard is available at: http://ledgerrocket-dashboard.s3-website-us-east-1.amazonaws.com