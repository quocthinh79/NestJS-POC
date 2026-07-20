# User Authentication Capability

## Purpose
Defines user registration, login, and JWT token authentication requirements.

## Requirements

### Requirement: User registration
The system SHALL allow unauthenticated users to register by providing an email, username, and password.

#### Scenario: Successful registration
- **WHEN** a user submits a valid email, username, and password to `POST /auth/register`
- **THEN** the system creates a new user with a UUID, hashes the password with bcrypt (cost 10), stores the record in MySQL, and returns `{ id, email, username }`

#### Scenario: Duplicate email rejection
- **WHEN** a user submits an email that already exists in the database
- **THEN** the system returns an error with status 409 and error code `EMAIL_ALREADY_REGISTERED`

#### Scenario: Welcome email sent on registration
- **WHEN** a user successfully registers
- **THEN** the system sends a welcome email via SendGrid to the registered email address (fire-and-forget)

#### Scenario: Invalid registration input
- **WHEN** a user submits a registration request missing required fields or with invalid data
- **THEN** the system returns a 400 error with validation details (via class-validator)

### Requirement: User login
The system SHALL allow registered users to authenticate with email and password and receive a JWT access token.

#### Scenario: Successful login
- **WHEN** a user submits a valid email and password to `POST /auth/login`
- **THEN** the system verifies the password against the bcrypt hash and returns `{ accessToken, id, email, role }`

#### Scenario: Login with non-existent email
- **WHEN** a user submits an email that does not exist in the database
- **THEN** the system returns an error with status 404 and error code `USER_NOT_FOUND`

#### Scenario: Login with wrong password
- **WHEN** a user submits a valid email but incorrect password
- **THEN** the system returns an error with status 401 and error code `INVALID_CREDENTIALS`

### Requirement: JWT token structure
The system SHALL issue JWT tokens containing the user's identity and role information.

#### Scenario: Token payload contents
- **WHEN** the system issues a JWT token
- **THEN** the token payload SHALL contain `{ sub: <user-id>, email: <user-email>, role: <user-role> }`

#### Scenario: Token validation
- **WHEN** a request includes a Bearer token in the Authorization header
- **THEN** the api-gateway's JwtStrategy SHALL extract and validate it using the configured secret, and populate `req.user` with `{ id, email, role }`
