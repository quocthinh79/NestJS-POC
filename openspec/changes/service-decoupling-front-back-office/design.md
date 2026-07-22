## Context

The system currently runs `backend/user-service` for handling user authentication, profile management, posts, and administrative store/country configuration entities within a single backend service. The frontend is a monolithic Next.js application in `frontend/`. To establish proper domain separation, security isolation, and distinct release cycles, the codebase is being decoupled into Front-Office (FO) and Back-Office (BO) services across both backend and frontend layers.

## Goals / Non-Goals

**Goals:**
- Refactor `backend/user-service` into `backend/front-office`, retaining end-user business logic (auth, profile, posts).
- Create `backend/back-office` as a separate NestJS microservice handling admin operations (store info, country info, affiliate info).
- Update `backend/api-gateway` to proxy client HTTP requests to both `front-office` and `back-office` NestJS TCP microservices.
- Split `frontend` directory into `frontend/front-office` (end-user UI) and `frontend/back-office` (admin dashboard UI).
- Maintain single shared database (`nestjs_db`) connection across both backend services.

**Non-Goals:**
- Splitting the database into separate physical database instances or micro-databases.
- Changing authentication JWT secret or core database schema.

## Decisions

### Decision 1: Shared Database Model with Service Boundary Isolation
- **Choice**: `backend/front-office` and `backend/back-office` connect to the same MySQL database (`nestjs_db`).
- **Rationale**: Keeps transactional integrity and avoids redundant data synchronization while providing distinct codebases for business rules.
- **Alternatives Considered**: Database-per-service (rejected due to unnecessary data duplication and migration complexity at this stage).

### Decision 2: API Gateway Routing & TCP Microservice Transport
- **Choice**: `api-gateway` defines two separate TCP `ClientProxy` instances: `FRONT_OFFICE_SERVICE` (TCP port 3001) and `BACK_OFFICE_SERVICE` (TCP port 3002).
- **Rationale**: Clear network and architectural separation for RPC calls from Gateway to downstream services.
- **Alternatives Considered**: Direct HTTP REST calls between gateway and microservices (rejected to remain consistent with NestJS TCP microservice pattern).

### Decision 3: Frontend Separation into Parallel Web Apps
- **Choice**: Split `frontend/` into `frontend/front-office` (Next.js app for end users) and `frontend/back-office` (Next.js app with Ant Design for admin staff).
- **Rationale**: Isolates user UI from admin dashboard UI, reducing bundle sizes and preventing security leakage of admin features.

## Risks / Trade-offs

- **[Risk] Shared Database Entity Coupling** → Mitigation: Keep entity definitions synchronized and clearly partition ownership of read/write entities per service.
- **[Risk] Gateway Routing & Port Conflicts** → Mitigation: Explicitly declare distinct TCP ports (3001 for FO, 3002 for BO) in environment files and gateway configs.
- **[Risk] Frontend Code Duplication** → Mitigation: Maintain shared types, DTO contracts, and UI conventions between `frontend/front-office` and `frontend/back-office`.

## Migration Plan

1. Rename `backend/user-service` directory to `backend/front-office` and clean up admin-only entity controllers.
2. Bootstrap `backend/back-office` microservice with NestJS CLI, CQRS, and TypeORM pointing to `nestjs_db`.
3. Move admin controllers and entities (StoreInfo, CountryInfo, AffiliateInfo) into `backend/back-office`.
4. Update `backend/api-gateway` modules and TCP proxy clients to route FO endpoints to TCP 3001 and BO endpoints to TCP 3002.
5. Move/split `frontend` files into `frontend/front-office` and `frontend/back-office`.
