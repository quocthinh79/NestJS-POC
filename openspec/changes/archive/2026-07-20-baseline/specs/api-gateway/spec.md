## ADDED Requirements

### Requirement: HTTP API surface
The api-gateway SHALL expose a REST HTTP API on a configurable port (default 3001) and proxy all business logic to the user-service microservice via TCP.

#### Scenario: Gateway listens on configured port
- **WHEN** the api-gateway starts
- **THEN** it listens on `process.env.PORT` or port 3001 by default

#### Scenario: TCP proxy to user-service
- **WHEN** the api-gateway receives an HTTP request matching a registered route
- **THEN** it sends a corresponding message via `ClientProxy` (TCP transport) to the user-service at `process.env.USER_SERVICE_HOST:USER_SERVICE_PORT` (default `127.0.0.1:4001`)

### Requirement: Request validation
The api-gateway SHALL validate all incoming request bodies against DTO schemas before proxying.

#### Scenario: Valid request passes validation
- **WHEN** a request body matches the DTO schema
- **THEN** the request proceeds to the controller handler

#### Scenario: Extra properties rejected
- **WHEN** a request body contains properties not defined in the DTO
- **THEN** the system returns 400 Bad Request (`forbidNonWhitelisted: true`)

#### Scenario: Missing required properties
- **WHEN** a request body is missing required DTO properties
- **THEN** the system returns 400 Bad Request with validation error details

### Requirement: Response envelope
The api-gateway SHALL wrap all successful responses in a standard envelope format.

#### Scenario: Successful response envelope
- **WHEN** a controller handler returns data
- **THEN** the ResponseInterceptor wraps it as `{ success: true, data: <response>, code: 200, errorMessage: null, paging: <if present> }`

#### Scenario: Paginated response envelope
- **WHEN** a controller handler returns data with a `paging` property
- **THEN** the ResponseInterceptor includes the `paging` object in the envelope

### Requirement: Error response format
The api-gateway SHALL normalize all errors into a consistent JSON format.

#### Scenario: HTTP exception formatting
- **WHEN** an HttpException is thrown
- **THEN** the HttpExceptionsFilter returns `{ success: false, errorMessage, errorMessageCode, data: null }` with the appropriate HTTP status code

#### Scenario: RPC error proxying
- **WHEN** the user-service throws an RpcException with `{ errorMessage, status, errorCode }`
- **THEN** the api-gateway re-throws it as an HttpException, which is caught and formatted by the HttpExceptionsFilter

### Requirement: CORS policy
The api-gateway SHALL allow cross-origin requests from configured origins.

#### Scenario: Allowed origins
- **WHEN** a request arrives from `localhost:3000`, `localhost:3001`, or `127.0.0.1:3001`
- **THEN** the system allows the request with credentials

### Requirement: Swagger documentation
The api-gateway SHALL serve interactive API documentation.

#### Scenario: Swagger UI available
- **WHEN** a user navigates to `/docs`
- **THEN** the system serves a Swagger UI with all documented endpoints, including Bearer authentication support
