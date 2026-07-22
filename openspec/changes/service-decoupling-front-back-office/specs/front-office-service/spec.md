## ADDED Requirements

### Requirement: End-User Authentication and Profile Management
The `front-office` backend service SHALL handle end-user user registration, login authentication, JWT verification, and user profile retrieval.

#### Scenario: End-user logs into front-office system
- **WHEN** end user sends valid credentials to front-office authentication endpoint
- **THEN** front-office service validates credentials and returns JWT access token with user profile details

### Requirement: End-User Post Operations
The `front-office` backend service SHALL handle end-user post creation, update, deletion, and query operations.

#### Scenario: End-user creates a new post
- **WHEN** authenticated end user submits post payload to front-office posts endpoint
- **THEN** front-office service persists post in shared database linked to user ID and returns created post payload
