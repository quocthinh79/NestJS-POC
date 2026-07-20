# Authorization Capability

## Purpose
Defines JWT auth, role-based access control, ownership verification, and self-action prevention guard requirements.

## Requirements

### Requirement: JWT authentication guard
The system SHALL protect endpoints with JWT authentication when the `JwtAuthGuard` is applied.

#### Scenario: Valid token accepted
- **WHEN** a request includes a valid Bearer token in the Authorization header
- **THEN** the JwtStrategy validates the token, extracts `{ id: sub, email, role }`, and sets `req.user`

#### Scenario: Missing token rejected
- **WHEN** a request to a JWT-protected endpoint has no Authorization header
- **THEN** the system returns 401 Unauthorized

#### Scenario: Invalid or expired token rejected
- **WHEN** a request includes an invalid or expired Bearer token
- **THEN** the JwtAuthGuard throws UnauthorizedException (401)

### Requirement: Role-based access control
The system SHALL restrict endpoint access based on user roles when `RolesGuard` and `@Roles()` decorator are applied.

#### Scenario: User with required role allowed
- **WHEN** a request is made by a user whose `role` matches one of the roles specified by `@Roles()`
- **THEN** the request proceeds to the controller handler

#### Scenario: User without required role denied
- **WHEN** a request is made by a user whose `role` does not match any role in `@Roles()`
- **THEN** the system returns 403 Forbidden with error code `FORBIDDEN`

#### Scenario: No roles decorator on endpoint
- **WHEN** an endpoint does not have `@Roles()` applied but has `RolesGuard`
- **THEN** the guard allows access (passes through)

### Requirement: Ownership verification
The system SHALL restrict resource access to the resource owner when `OwnershipGuard` is applied.

#### Scenario: Owner accesses own resource
- **WHEN** a request is made where `req.user.id` equals `req.params.id`
- **THEN** the guard allows access

#### Scenario: Non-owner access denied
- **WHEN** a request is made where `req.user.id` does not equal `req.params.id`
- **THEN** the system returns 403 Forbidden with "You do not own this resource"

### Requirement: Self-action prevention
The system SHALL prevent users from performing certain actions on their own account when `ExceptOwnershipGuard` is applied.

#### Scenario: Action on different user allowed
- **WHEN** a request is made where `req.user.id` does not equal `req.params.id`
- **THEN** the guard allows access

#### Scenario: Action on self denied
- **WHEN** a request is made where `req.user.id` equals `req.params.id`
- **THEN** the system returns 403 Forbidden with "You cannot access your own resource with this guard"
