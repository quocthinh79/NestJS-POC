## ADDED Requirements

### Requirement: Create post
The system SHALL allow authenticated users to create posts linked to their account.

#### Scenario: Successful post creation
- **WHEN** an authenticated user sends `POST /posts` with `{ title, content }`
- **THEN** the system creates a post with the provided title and content, sets `ownerId` to the authenticated user's ID, and returns the saved post record

#### Scenario: Unauthenticated post creation
- **WHEN** an unauthenticated user sends `POST /posts`
- **THEN** the system returns 401 Unauthorized

#### Scenario: Invalid post data
- **WHEN** an authenticated user sends `POST /posts` with missing title or content
- **THEN** the system returns a validation error via RpcException
