# NestJS Proof of Concept (NestJS-POC)

A full-stack monorepo demonstrating a microservices architecture using **NestJS**, **Next.js 14**, and **MySQL**.

---

## 🏗️ System Architecture & Topology

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                       │
│   ┌──────────────────┐       ┌──────────────────────────┐                │
│   │  Next.js Frontend │       │  Swagger UI (/docs)      │                │
│   │  :3000            │       │  :3001/docs              │                │
│   │  Axios → :3001    │       │                          │                │
│   └────────┬─────────┘       └────────────┬─────────────┘                │
└────────────┼──────────────────────────────┼──────────────────────────────┘
             │ HTTP                          │ HTTP
             ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY  (NestJS :3001)                          │
│                                                                          │
│  AuthController │ UsersController │ PostsController                      │
│  JwtStrategy │ RolesGuard │ OwnershipGuard │ ResponseInterceptor        │
│  HttpExceptionsFilter │ Swagger UI │ ValidationPipe                       │
└────────────────────┼────────────────────────────────────┘
                     │ TCP :4001 (ClientProxy)
                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  USER SERVICE  (NestJS Microservice :4001)                │
│                                                                          │
│  CQRS (CommandBus) │ RegisterUserHandler │ LoginUserHandler             │
│  ListUserHandler │ DeleteUserHandler │ TypeORM Repository               │
└────────────────────┼────────────────────────────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │   MySQL :3307    │
           │   nestjs_db      │
           └──────────────────┘
```

---

## 🛠️ Technology Stack

### Backend – API Gateway (`backend/api-gateway`)
- **Framework**: NestJS 10, TypeScript
- **Microservice Client**: `@nestjs/microservices` (TCP transport)
- **Auth**: `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`
- **Docs & Tools**: `@nestjs/swagger`, `class-validator`, `class-transformer`

### Backend – User Service (`backend/user-service`)
- **Framework**: NestJS 10 (Microservice mode)
- **Architecture**: CQRS (`@nestjs/cqrs` CommandBus)
- **ORM & Database**: TypeORM 0.3, MySQL (`mysql2`)
- **Utilities**: `bcrypt` (password hashing), `@sendgrid/mail` (email delivery)

### Frontend (`frontend/`)
- **Framework**: Next.js 14 (App Router, React 18)
- **UI & Styling**: Ant Design (`antd` v5), `@ant-design/nextjs-registry`
- **Data Fetching**: Axios, SWR (`useSWR`, `useSWRMutation`)

---

## 🚀 Group 1: How to Run Source Code

### Prerequisites
- **Node.js**: v18+ or v20+ with `npm`
- **Docker**: For running the MySQL container

---

### Step 1: Start MySQL Database
Launch MySQL 8 on port **3307**:

```bash
docker run -d \
  --name nestjs_mysql \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=nestjs_db \
  mysql:8
```

---

### Step 2: Start User Microservice
Open **Terminal Window #1**:

```bash
cd backend/user-service
npm install
npm run start:dev
```

- **Output**: `✅ Users microservice is running on port 4001`
- **Address**: `tcp://127.0.0.1:4001`

---

### Step 3: Start API Gateway
Open **Terminal Window #2**:

```bash
cd backend/api-gateway
npm install
npm run start:dev
```

- **Output**: `🚀 API Gateway is running on http://localhost:3001`
- **Swagger Documentation**: [http://localhost:3001/docs](http://localhost:3001/docs)

---

### Step 4: Start Frontend Application
Open **Terminal Window #3**:

```bash
cd frontend
npm install
npm run dev
```

- **Output**: Next.js app ready on [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Group 2: How to Migrate and Rollback Database

All TypeORM migration operations are managed inside `backend/user-service`:

### 1. Run (Apply) Migrations
To execute all pending migrations against the MySQL database:

```bash
cd backend/user-service
npm run migration:run
```

> **Automatic Execution Note**: `AppDataSource` in `src/data-source.ts` has `migrationsRun: true` enabled by default. Pending migrations run automatically whenever the User Service starts up.

---

### 2. Rollback (Revert) Migrations
To undo/revert the most recently executed migration batch:

```bash
cd backend/user-service
npm run migration:revert
```

*Run the command multiple times to rollback consecutive migration steps.*

---

### 3. Generate New Migrations
To generate a new migration file based on differences between your TypeORM entity definitions and current database schema:

```bash
cd backend/user-service
npm run migration:generate -- src/migrations/<MigrationName>
```

---

### 4. Migration Commands Summary

| Action | Command | Working Directory | Description |
|---|---|---|---|
| **Run Migrations** | `npm run migration:run` | `backend/user-service` | Applies all pending migrations to the database |
| **Rollback Migration** | `npm run migration:revert` | `backend/user-service` | Reverts the last executed migration |
| **Generate Migration** | `npm run migration:generate -- src/migrations/<Name>` | `backend/user-service` | Generates a new migration file from entity diffs |

---

### 5. ⚠️ Production-Ready Migration Best Practices & Safeguards

#### 💡 Why You Must Keep These in Mind
In a production microservice environment, database schema changes carry severe risks if handled carelessly:
- **Prevent Data Loss & Corruption**: Uncontrolled auto-sync or unverified DDL scripts can permanently delete or corrupt live production data.
- **Ensure Zero-Downtime & High Availability**: Breaking schema changes (such as dropping a column actively read by running app instances) crash microservices and cause system outages.
- **Avoid Deployment Deadlocks**: Auto-executing migrations across multiple parallel microservice pods causes database lock contention, deployment timeouts, and container boot loops.
- **Enable Rapid Emergency Recovery**: Tested rollback scripts (`down()`) ensure you can safely revert a failed release without database corruption or downtime.

---

#### 📌 Essential Production Rules & Rationale:

1. **Disable `synchronize: true` in Production**:
   - **Why keep this in mind**: TypeORM's auto-sync inspects entity definitions on app startup and automatically issues `DROP COLUMN` or `ALTER TABLE` statements against the database. In production, modifying or renaming an entity property will result in **catastrophic and permanent data loss**.
   - **Production Standard**: Set `synchronize: false` in `src/data-source.ts` and rely strictly on version-controlled migration files.

2. **Disable `migrationsRun: true` in Multi-Instance Deployments**:
   - **Why keep this in mind**: When deploying multiple replica containers (e.g. Kubernetes pods or ECS tasks), every instance running `migrationsRun: true` on boot will attempt schema modifications simultaneously. This triggers **concurrent schema lock contention, deadlocks, deployment timeouts, and container boot loops**.
   - **Production Standard**: Disable `migrationsRun` during app runtime. Execute `npm run migration:run` in a single isolated step (CI/CD pipeline, Kubernetes `Job`, or `initContainer`) *before* rolling out new application pods.

3. **Follow the Expand-Contract (Zero-Downtime Migration) Pattern**:
   - **Why keep this in mind**: During rolling updates, old and new application instances run side-by-side. Immediate breaking schema changes (such as dropping a column or renaming a field) instantly crash old app pods still serving live user requests, causing **500 Internal Server Errors and broken user sessions**.
   - **Production Standard**:
     - **Phase 1 (Expand)**: Add new columns as `NULLABLE` or with safe default values. Both old and new code versions remain fully functional.
     - **Phase 2 (Backfill)**: Populate new column data in small background batches without locking production tables.
     - **Phase 3 (Contract)**: Drop old unused columns/tables in a separate follow-up release **only after** 100% of running app instances have updated to the new code.

4. **Verify Rollback (`down()`) Scripts in Staging**:
   - **Why keep this in mind**: If a deployment fails midway in production, you must be able to revert both application code and database schema instantly. Without a tested `down()` method, a failed release leaves the database in an **inconsistent hybrid state**, preventing clean code rollbacks and prolonging downtime.
   - **Production Standard**: Always test both forward (`npm run migration:run`) and rollback (`npm run migration:revert`) execution in a staging environment prior to production release.

5. **Beware of MySQL Implicit Transaction Commits**:
   - **Why keep this in mind**: Unlike PostgreSQL, MySQL automatically commits the active transaction whenever DDL statements (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`) are executed. If a migration contains multiple DDL operations and fails halfway, **MySQL CANNOT roll back the already-executed DDL statements**, leaving your schema partially migrated and corrupted.
   - **Production Standard**: Keep each migration file small, modular, and focused on a single atomic schema change.

6. **Avoid Long Table Locks on Large Tables**:
   - **Why keep this in mind**: Altering columns or adding indexes on tables containing millions of records acquires an exclusive metadata lock in MySQL. This leads to **query timeouts, API request queueing, connection pool exhaustion, and complete application downtime**.
   - **Production Standard**: Use MySQL 8 Online DDL flags (`ALGORITHM=INPLACE, LOCK=NONE`) or online schema change tools (such as `gh-ost` or `pt-online-schema-change`) to migrate large production tables without blocking live reads and writes.

---

## 🎯 Verification & Services Overview

| Component | URL / Address | Description |
|---|---|---|
| **Frontend App** | [http://localhost:3000](http://localhost:3000) | User & Admin UI |
| **API Gateway** | [http://localhost:3001](http://localhost:3001) | REST API Entrypoint |
| **Swagger Docs** | [http://localhost:3001/docs](http://localhost:3001/docs) | Interactive API Documentation |
| **User Service** | `tcp://127.0.0.1:4001` | TCP Microservice |
| **MySQL Database** | `localhost:3307` | Database `nestjs_db` |

---

## 🗄️ Connecting to Database with DataGrip

Follow these steps to connect **JetBrains DataGrip** (or IntelliJ IDEA / WebStorm Database tools) to the MySQL instance:

1. **Open DataGrip**:
   * Open the **Database** tool window.
   * Click **`+`** (New) ➔ **`Data Source`** ➔ Select **`MySQL`**.

2. **Configure Connection Parameters**:
   * **Host**: `localhost` (or `127.0.0.1`)
   * **Port**: `3307`
   * **User**: `root`
   * **Password**: `root`
   * **Database**: `nestjs_db`

3. **Driver Setup**:
   * If DataGrip displays *Missing driver files*, click **`Download Driver`** at the bottom of the dialog.

4. **Test & Save Connection**:
   * Click **`Test Connection`** (verify green `Succeeded` message).
   * Click **`Apply`** and **`OK`**.
   * Expand `nestjs_db` ➔ `schemas` ➔ `tables` to inspect tables.

---

## 🧪 Testing

To run tests across services:

```bash
# API Gateway unit & e2e tests
cd backend/api-gateway
npm test
npm run test:e2e

# User Service unit tests
cd backend/user-service
npm test
```
