# MCC Finance Planner - AI Coding Agent Instructions

## Project Overview
MCC Finance Planner is a financial planning application designed to help users manage their personal finances, budget tracking, and financial goal planning. This project is currently in its initial development phase.

## Architecture & Design Patterns

### Current State
- **Minimal Setup**: Repository contains only basic README.md
- **Future Architecture**: This will be a finance planning application requiring:
  - User authentication and data security
  - Financial data management and calculations
  - Budget tracking and reporting
  - Goal setting and progress monitoring

### Expected Technology Stack
When implementing features, consider these patterns:
- **Security First**: All financial data must be handled with encryption and secure practices
- **Data Validation**: Implement strict validation for all financial inputs and calculations
- **Audit Trail**: Maintain logs of all financial transactions and changes
- **Responsive Design**: Ensure accessibility across devices for financial management

## Development Workflows

### Getting Started
Since this is a new project, when adding code:
1. Choose appropriate technology stack (suggested: modern web framework with secure backend)
2. Implement proper project structure with clear separation of concerns
3. Set up development, testing, and production environments
4. Configure CI/CD pipeline for automated testing and deployment

### Financial Application Best Practices
- **Decimal Precision**: Use appropriate decimal/currency libraries for financial calculations
- **Input Sanitization**: Validate and sanitize all user inputs, especially financial data
- **Error Handling**: Implement comprehensive error handling for financial operations
- **Testing**: Write thorough tests for all financial calculations and business logic
- **Documentation**: Document all financial formulas and business rules clearly

## Project-Specific Conventions

### Naming Conventions
- Use clear, descriptive names for financial concepts (e.g., `monthlyBudget`, `savingsGoal`)
- Prefix financial amount variables with currency context when applicable
- Use consistent terminology for financial operations across the codebase

### Code Organization
- Separate financial calculation logic from UI components
- Create dedicated modules for different financial aspects (budgeting, goals, reporting)
- Implement proper data models for financial entities
- Use configuration files for financial constants (tax rates, limits, etc.)

### Security Considerations
- Never log sensitive financial data
- Implement proper session management
- Use HTTPS for all communications
- Follow OWASP guidelines for web application security
- Consider compliance requirements (PCI DSS, etc.)

## Integration Points

### Expected External Services
- Banking APIs for account integration
- Currency conversion services
- Tax calculation services
- Credit score monitoring APIs
- Financial data aggregation services

### Data Flow Patterns
- Implement proper data validation at API boundaries
- Use structured logging for financial transactions
- Implement backup and recovery procedures for financial data
- Consider real-time vs. batch processing for different financial operations

## Key Files & Directories (Future Structure)
- `/src/models/` - Financial data models and entities
- `/src/services/` - Business logic for financial operations
- `/src/utils/financial.js` - Core financial calculation utilities
- `/src/security/` - Authentication and authorization modules
- `/tests/financial/` - Comprehensive tests for financial calculations
- `/config/` - Environment-specific configuration files

## Notes for AI Agents
- Prioritize data accuracy and security in all financial implementations
- Always include comprehensive tests for financial calculations
- Consider edge cases in financial scenarios (negative balances, currency conversion, etc.)
- Implement proper error handling for financial operations
- Document all financial business rules and calculations clearly
- Follow financial industry best practices and compliance requirements