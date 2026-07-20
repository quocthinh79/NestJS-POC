## ADDED Requirements

### Requirement: List users with pagination
The system SHALL allow listing users with pagination and search filtering.

#### Scenario: Default paginated listing
- **WHEN** a client sends `GET /users` without parameters
- **THEN** the system returns the first 10 users ordered by `createdAt DESC`, with paging metadata `{ total, page: 1, limit: 10, totalPages }`

#### Scenario: Custom page and limit
- **WHEN** a client sends `GET /users?page=2&limit=5`
- **THEN** the system returns up to 5 users for page 2, with the limit capped at 100

#### Scenario: Search filtering
- **WHEN** a client sends `GET /users?search=john`
- **THEN** the system returns users whose `name` or `email` contains "john" (case-insensitive LIKE match)

### Requirement: Create user
The system SHALL allow creating a user via `POST /users` with name, email, and password fields.

#### Scenario: Successful user creation
- **WHEN** a client submits valid user data to `POST /users`
- **THEN** the system validates the entity with class-validator, creates the user record, and returns the saved user

#### Scenario: Validation failure on create
- **WHEN** a client submits invalid data (e.g., invalid email format)
- **THEN** the system returns a validation error

### Requirement: View own profile
The system SHALL allow authenticated users to view their own profile.

#### Scenario: Retrieve own profile
- **WHEN** an authenticated user sends `GET /users/profile`
- **THEN** the system extracts the user ID from the JWT token and returns the user record from the database

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user sends `GET /users/profile`
- **THEN** the system returns 401 Unauthorized

### Requirement: View specific user profile
The system SHALL allow authenticated users to view their own profile by ID, restricted by ownership.

#### Scenario: Owner views own profile by ID
- **WHEN** an authenticated user sends `GET /users/:id/profile` where `:id` matches their own user ID
- **THEN** the system returns the user's profile

#### Scenario: Non-owner access denied
- **WHEN** an authenticated user sends `GET /users/:id/profile` where `:id` does NOT match their own user ID
- **THEN** the system returns 403 Forbidden with error code `FORBIDDEN`

### Requirement: Delete user (admin only)
The system SHALL allow admin users to delete other users, but SHALL prevent self-deletion.

#### Scenario: Admin deletes another user
- **WHEN** an admin user sends `DELETE /users/:id` where `:id` is a different user's UUID
- **THEN** the system removes the user record and returns a success message

#### Scenario: Admin attempts self-deletion
- **WHEN** an admin user sends `DELETE /users/:id` where `:id` is their own user ID
- **THEN** the system returns 403 Forbidden (ExceptOwnershipGuard prevents self-deletion)

#### Scenario: Non-admin attempts deletion
- **WHEN** a non-admin user sends `DELETE /users/:id`
- **THEN** the system returns 403 Forbidden (RolesGuard rejects non-admin roles)

#### Scenario: Delete non-existent user
- **WHEN** an admin sends `DELETE /users/:id` with a UUID that does not exist
- **THEN** the system returns an RpcException with "User not found"
