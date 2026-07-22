## ADDED Requirements

### Requirement: Administrative Store and System Configuration
The `back-office` backend service SHALL manage administrative configurations including StoreInfo, CountryInfo, and AffiliateInfo entity management.

#### Scenario: Admin user updates store configuration
- **WHEN** admin user sends store configuration update request to back-office endpoint
- **THEN** back-office service verifies admin authorization, updates store configuration in shared database, and returns updated configuration

### Requirement: Admin User and Role Governance
The `back-office` backend service SHALL provide endpoints for managing admin users, store roles, and system level settings.

#### Scenario: Admin queries system store details
- **WHEN** authenticated admin requests store list from back-office endpoints
- **THEN** back-office service retrieves store configurations from shared database and returns result payload
