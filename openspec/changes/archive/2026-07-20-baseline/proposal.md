## Why

The NestJS-POC project has no formal specification of its existing behavior. Before making any improvements or adding features, we need a documented baseline of what the system currently does — its capabilities, contracts, and expected behaviors. This prevents regressions and gives future changes a clear reference point.

## What Changes

- **No code changes.** This is a documentation-only change.
- Create OpenSpec capability specs that describe the current system behavior as-is.
- Establish the spec foundation for all future change proposals to build on.

## Capabilities

### New Capabilities
- `user-authentication`: Covers user registration (with email, username, password), login (email + password → JWT), and JWT token structure/validation.
- `user-management`: Covers listing users (paginated, searchable), viewing own profile, viewing specific user profile (ownership-restricted), creating users, and deleting users (admin-only, self-delete prevented).
- `post-management`: Covers creating posts (authenticated, linked to owner).
- `api-gateway`: Covers the HTTP API surface, request validation, response envelope format, CORS policy, error normalization, Swagger documentation, and the TCP proxy pattern to the user-service microservice.
- `authorization`: Covers the guard system — JWT authentication, role-based access control, ownership verification, and the except-ownership (self-action prevention) pattern.

### Modified Capabilities
_(none — no existing specs to modify)_

## Impact

- **New files only**: `openspec/specs/<capability>/spec.md` for each capability listed above.
- **No code changes**: All existing source files remain untouched.
- **No runtime impact**: Specs are documentation artifacts only.
