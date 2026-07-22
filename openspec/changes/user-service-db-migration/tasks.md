## 1. TypeORM Infrastructure & Configuration

- [x] 1.1 Add TypeORM CLI scripts to `backend/user-service/package.json` (`typeorm`, `migration:generate`, `migration:run`).
- [x] 1.2 Update `backend/user-service/src/data-source.ts` to set `synchronize: false` and configure `migrationsRun: true`.

## 2. Enums and Entity Definitions

- [x] 2.1 Create enum definitions (`auth_provider.enum.ts`, `theme.enum.ts`) in `backend/user-service/src/common/enums/`.
- [x] 2.2 Create `CountryInfo` entity in `backend/user-service/src/common/entities/country-info.entity.ts`.
- [x] 2.3 Create `AffiliateInfo` entity in `backend/user-service/src/common/entities/affiliate-info.entity.ts`.
- [x] 2.4 Update `User` entity in `backend/user-service/src/common/entities/users.entity.ts` with expanded fields and relations.

## 3. Migration Scripts & Data Backfilling

- [x] 3.1 Create production migration script in `backend/user-service/src/migrations/` to create new tables, enums, and foreign keys.
- [x] 3.2 Add SQL data transformation steps to copy legacy `password` to `password_hash` and assign default enums.
- [x] 3.3 Add reference data seeding for default `COUNTRY_INFO` records (`vi-VN` / `VND`) in migration `up()`.

## 4. Service Verification & Testing

- [x] 4.1 Update existing user service references and commands to use `password_hash`.
- [x] 4.2 Run unit tests and verify TypeScript build in `backend/user-service`.
