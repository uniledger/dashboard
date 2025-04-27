 # Makefile for LedgerRocket Dashboard
#
# Standard targets for a React project using Create React App.

.PHONY: help install start dev build test lint lint-fix check clean serve watch

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  install    Install dependencies (npm install)"
	@echo "  start      Start development server (npm start)"
	@echo "  dev        Alias for 'watch'"
	@echo "  build      Build for production (npm run build)"
	@echo "  test       Run tests (npm test)"
	@echo "  lint       Run ESLint (npm run lint)"
	@echo "  lint-fix   Run ESLint with --fix flag (npm run lint -- --fix)"
	@echo "  check      Run lint and test"
	@echo "  clean      Remove build directory"
	@echo "  serve      Serve production build (npx serve -s build)"

install:
	npm install

start:
	npm start

dev: watch

build:
	npm run build

test:
	npm test

lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

check: lint test

clean:
	rm -rf build

serve:
	npx serve -s build

# Watch source files and restart dev server on changes
watch:
	npx nodemon --watch src --ext js,jsx,ts,tsx --exec "npm start"