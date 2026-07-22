## Why

Currently, `backend/user-service` and the root `frontend` project combine end-user application features with administrative configuration logic. Decoupling the applications into dedicated Front-Office and Back-Office systems for both backend and frontend enforces clear domain separation, dedicated authorization scopes, and independent service scaling while leveraging a shared database foundation.

## What Changes

- **BREAKING**: Refactor and rename `backend/user-service` into `backend/front-office`, dedicated exclusively to end-user features (user authentication, profile management, posts).
- Create `backend/back-office` as a new NestJS TCP microservice handling administrative workflows and store configurations (store info, country info, affiliate info).
- Update `backend/api-gateway` to proxy incoming HTTP requests to both `front-office` and `back-office` microservices via dedicated TCP clients.
- **BREAKING**: Restructure the single `frontend` workspace into `frontend/front-office` (end-user web app) and `frontend/back-office` (admin management dashboard).
- Both backend services connect to the same shared MySQL database (`nestjs_db`), sharing entity definitions while separating domain controllers and business logic.

## Capabilities

### New Capabilities
- `front-office-service`: End-user customer facing logic covering authentication, profile endpoints, and post interactions.
- `back-office-service`: Administrative portal logic covering store management, country configuration, affiliate configuration, and back-office management tasks.

### Modified Capabilities
None

## Impact

- `backend/front-office` (refactored from `backend/user-service`)
- `backend/back-office` (new microservice)
- `backend/api-gateway` (updated proxy controllers and TCP microservice clients)
- `frontend/front-office` and `frontend/back-office` (reorganized frontend directories)
- Port allocations, environment configuration files, and package scripts
