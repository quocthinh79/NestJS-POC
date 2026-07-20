## 1. Sync Baseline Specs to Main OpenSpec

- [x] 1.1 Copy `specs/user-authentication/spec.md` to `openspec/specs/user-authentication/spec.md`
- [x] 1.2 Copy `specs/user-management/spec.md` to `openspec/specs/user-management/spec.md`
- [x] 1.3 Copy `specs/post-management/spec.md` to `openspec/specs/post-management/spec.md`
- [x] 1.4 Copy `specs/api-gateway/spec.md` to `openspec/specs/api-gateway/spec.md`
- [x] 1.5 Copy `specs/authorization/spec.md` to `openspec/specs/authorization/spec.md`

## 2. Verify Spec Accuracy

- [x] 2.1 Review `user-authentication` spec scenarios against `RegisterUserHandler` and `LoginUserHandler` source code
- [x] 2.2 Review `user-management` spec scenarios against `UsersController` (api-gateway) and `UsersController` + `ListUserHandler` + `DeleteUserHandler` (user-service)
- [x] 2.3 Review `post-management` spec scenarios against `PostsController` (api-gateway) and `PostsController` + `PostService` (user-service)
- [x] 2.4 Review `api-gateway` spec scenarios against `main.ts`, `ResponseInterceptor`, `HttpExceptionsFilter`, and CORS config
- [x] 2.5 Review `authorization` spec scenarios against `JwtAuthGuard`, `RolesGuard`, `OwnershipGuard`, and `ExceptOwnershipGuard`
