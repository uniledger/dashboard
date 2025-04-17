# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm start`: Run dev server (localhost:3000)
- `npm build`: Create production build
- `npm test`: Run all tests
- `npm test -- --testPathPattern=ComponentName`: Run specific test

## Lint/Format
- Uses ESLint with react-app preset
- Follow existing indentation (2 spaces)
- Run `npm run lint` before committing changes

## Code Style
- React functional components with hooks
- Config-driven architecture (see modelConfig.js)
- JSDoc comments for functions and components

## Naming Conventions
- PascalCase for components (GenericDetailView.js)
- camelCase for hooks, utils, variables (useDataFetching)
- File organization by feature (accounts/, ledgers/)

## Component Guidelines
- Use existing generic components (GenericListView, GenericDetailView)
- Prefer composition over inheritance
- Destructure props with default values
- Use early returns for conditional rendering

## Data & Error Handling
- Use custom hooks for data fetching
- Try/catch with error states in hooks
- Clear user-facing error messages