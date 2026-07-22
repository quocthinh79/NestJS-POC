## 1. Backend Front-Office Refactoring

- [x] 1.1 Refactor and rename `backend/user-service` directory to `backend/front-office`
- [x] 1.2 Update package.json name and Nest CLI configuration in `backend/front-office`
- [x] 1.3 Remove administrative configuration endpoints and non-user modules from `backend/front-office`

## 2. Backend Back-Office Service Creation

- [x] 2.1 Bootstrap `backend/back-office` NestJS application structure with TypeORM and CQRS modules
- [x] 2.2 Configure `backend/back-office` database connection pointing to shared MySQL database (`nestjs_db`)
- [x] 2.3 Implement Store, Country, and Affiliate configuration controllers and services in `backend/back-office`
- [x] 2.4 Set up NestJS TCP microservice listener on port 3002 in `backend/back-office`

## 3. API Gateway Updates

- [x] 3.1 Register TCP ClientProxy instances for FRONT_OFFICE_SERVICE (port 3001) and BACK_OFFICE_SERVICE (port 3002) in `backend/api-gateway`
- [x] 3.2 Update gateway controllers and proxies to route end-user requests to Front-Office and admin requests to Back-Office

## 4. Frontend Workspace Restructuring

- [x] 4.1 Reorganize `frontend` workspace into `frontend/front-office` for end-user Next.js application
- [x] 4.2 Reorganize `frontend` workspace into `frontend/back-office` for admin dashboard Next.js application
- [x] 4.3 Update API endpoint configurations and environment files for both frontend projects

## 5. Verification & Zero-Error Validation

- [x] 5.1 Run full TypeScript compilation (`tsc --noEmit`) and linter checks across all services
- [x] 5.2 Run backend unit/E2E tests to verify zero remaining build or runtime errors
