# LedgerRocket Banking Dashboard

A web-based dashboard for the LedgerRocket Banking API that provides visualizations and management of accounts, ledgers, and financial data.

## Features

- **Account Management**: View and manage banking accounts
- **Ledger Overview**: Explore different ledgers with associated currencies and entities
- **Financial Analytics**: Visual representations of financial data and account balances

## Technology Stack

- React
- Tailwind CSS
- Axios for API communication
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