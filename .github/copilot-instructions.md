# MCC Finance Planner - AI Coding Agent Instructions

## Project Overview
MCC Finance Planner is a financial planning application currently in early development. The project is built on Create React App and includes Vercel Analytics integration.

## Current Architecture

### Technology Stack
- **Frontend**: React 18.2.0 with Create React App 5.0.1
- **Testing**: Jest with React Testing Library (@testing-library/react, @testing-library/jest-dom)
- **Analytics**: Custom Vercel Analytics integration (`src/vitals.js`)
- **Development**: Docker Compose dev environment (`compose-dev.yaml`)
- **Package Manager**: pnpm (evidenced by `pnpm-lock.yaml`)

### Project Structure
```
src/
├── App.js          # Main React component (currently default CRA template)
├── index.js        # Entry point with Vercel analytics setup
├── vitals.js       # Custom Vercel Analytics implementation
├── App.test.js     # Basic component test
└── setupTests.js   # Jest configuration
```

## Development Workflows

### Getting Started
```bash
pnpm install          # Install dependencies
pnpm start            # Start development server (port 3000)
pnpm test             # Run tests in watch mode
pnpm build            # Create production build
```

### Docker Development
Use `compose-dev.yaml` for containerized development environment.

### Analytics Integration
The project includes custom Vercel Analytics via `src/vitals.js`:
- Requires `REACT_APP_VERCEL_ANALYTICS_ID` environment variable
- Automatically tracks Core Web Vitals and page metrics
- Uses `sendBeacon` API with fallback to fetch

## Project-Specific Patterns

### Current Implementation
- **React 18**: Uses legacy `ReactDOM.render()` (consider upgrading to `createRoot()`)
- **Strict Mode**: Enabled in development for better debugging
- **Web Vitals**: Custom implementation in `vitals.js` with connection speed detection
- **Testing**: Standard Jest + RTL setup with custom DOM matchers

### Upcoming Financial App Requirements
When implementing finance features:
- **Decimal Precision**: Use libraries like `decimal.js` or `big.js` for financial calculations
- **Input Validation**: Implement strict validation for financial inputs
- **Security**: Handle financial data with encryption and secure practices
- **Audit Trail**: Log all financial transactions and changes

## Key Files & Current Architecture

### Essential Files
- `src/vitals.js` - Custom Vercel Analytics implementation with browser capability detection
- `src/index.js` - App entry point with analytics integration
- `package.json` - CRA-based React app with testing library dependencies
- `compose-dev.yaml` - Docker development environment setup

### Integration Points
- **Analytics**: Vercel Analytics via custom vitals implementation
- **Testing**: Jest + React Testing Library for component testing
- **Build**: React Scripts for development and production builds
- **Environment**: Docker Compose for dev environment consistency

## Notes for AI Agents
- This is currently a default CRA template with Vercel Analytics added
- When adding financial features, prioritize data accuracy and security
- Follow React best practices and consider upgrading to React 18 concurrent features
- Maintain the existing testing setup and expand coverage for financial calculations
- Use the Docker environment for consistent development across team members