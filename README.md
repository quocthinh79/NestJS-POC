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
└────────────────────────────────────┼────────────────────────────────────┘
                                     │ TCP :4001 (ClientProxy)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  USER SERVICE  (NestJS Microservice :4001)                │
│                                                                          │
│  CQRS (CommandBus) │ RegisterUserHandler │ LoginUserHandler             │
│  ListUserHandler │ DeleteUserHandler │ TypeORM Repository               │
└────────────────────────────────────┼────────────────────────────────────┘
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

## 🚀 Step-by-Step Launch Guide

### Prerequisites
- Node.js (v18+ or v20+) and `npm`
- Docker (recommended for MySQL)

---

### Step 1: Start the MySQL Database

Run MySQL 8 via Docker on port **3307**:

```bash
docker run -d \
  --name nestjs_mysql \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=nestjs_db \
  mysql:8
```

---

### Step 2: Launch the User Service (Microservice)

Open **Terminal Window #1**:

```bash
cd backend/user-service
npm install
npm run start:dev
```

- **Output**: `✅ Users microservice is running on port 4001`
- **Port**: `4001` (TCP transport)

---

### Step 3: Launch the API Gateway

Open **Terminal Window #2**:

```bash
cd backend/api-gateway
npm install
npm run start:dev
```

- **Output**: `🚀 API Gateway is running on http://localhost:3001`
- **Swagger Docs**: [http://localhost:3001/docs](http://localhost:3001/docs)

---

### Step 4: Launch the Frontend

Open **Terminal Window #3**:

```bash
cd frontend
npm install
npm run dev
```

- **Output**: Next.js app ready on [http://localhost:3000](http://localhost:3000)

---

## 🎯 Verification & Services Overview

| Component | URL / Address | Description |
|---|---|---|
| **Frontend App** | [http://localhost:3000](http://localhost:3000) | User & Admin UI |
| **API Gateway** | [http://localhost:3001](http://localhost:3001) | REST API Entrypoint |
| **Swagger Docs** | [http://localhost:3001/docs](http://localhost:3001/docs) | Interactive API Spec |
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
   * Expand `nestjs_db` ➔ `schemas` ➔ `tables` to inspect `user` and `post` tables.

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
