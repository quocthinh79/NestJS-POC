## Context

The `user-service` database currently runs with `synchronize: true` and a legacy `User` entity structure. The user has requested to migrate the database schema to support expanded fields (OAuth providers, account status, theme preferences, 2FA parameters, country reference data, affiliate referral links) and transition to a production-ready, versioned migration workflow using TypeORM.

## Goals / Non-Goals

**Goals:**
- Replace development auto-synchronization with versioned TypeORM migrations (`migrationsRun: true`).
- Implement TypeScript enum types (`auth_provider_enum`, `theme_enum`, `role_in_store_enum`) and entities (`User`, `CountryInfo`, `AffiliateInfo`).
- Perform a 2-phase non-destructive migration script that copies data from legacy `password` to `password_hash` and fills default values.
- Automate initial `COUNTRY_INFO` reference seeding.

**Non-Goals:**
- Managing `STORE_INFO` and `USER_STORE` entities in `user-service` (these are owned by `store_service`).
- Implementing frontend UI or API Gateway controllers for 2FA or social login in this migration step.

## Decisions

### Decision 1: Service Ownership Boundary
- **Choice**: Keep `STORE_INFO` and `USER_STORE` out of `user-service` TypeORM entities.
- **Rationale**: `user-service` is responsible for identity and user profiles. Store metadata belongs to `store_service` in a microservices architecture.
- **Alternatives Considered**: Creating `USER_STORE` cross-database join in TypeORM (rejected due to microservice domain coupling).

### Decision 2: 2-Phase Non-Destructive Data Migration
- **Choice**: Write custom SQL in the TypeORM migration `up()` method:
  1. `ADD COLUMN password_hash` (nullable)
  2. `UPDATE USER SET password_hash = password`
  3. Set default values for enums and reference fields (`prefer_language = 'vi-VN'`, `auth_provider = 'LOCAL'`, `account_status = 1`, `theme = 'SYSTEM'`).
  4. `ALTER COLUMN password_hash SET NOT NULL`
  5. `DROP COLUMN password`
- **Rationale**: Direct column renames or table drops in production would erase existing user passwords and cause downtime.

### Decision 3: TypeORM Migration Config via `data-source.ts`
- **Choice**: Export `AppDataSource` in `data-source.ts` with `synchronize: false`, `migrations: [__dirname + '/migrations/*{.ts,.js}']`, and `migrationsRun: true`.
- **Rationale**: Standard TypeORM CLI pattern compatible with NestJS `TypeOrmModule.forRootAsync`.

## Risks / Trade-offs

- **[Risk]** SQL migration failure halfway through execution.
  - **Mitigation**: Wrap data transformation statements inside explicit MySQL transactions within `migration.up()` and test rollback in `migration.down()`.
- **[Risk]** Missing `COUNTRY_INFO` record when attaching foreign key to `country_id`.
  - **Mitigation**: Seed default `COUNTRY_INFO` record before applying foreign key constraint on `USER.country_id`.

## Migration Plan

1. Update `package.json` with TypeORM migration scripts (`typeorm`, `migration:generate`, `migration:run`).
2. Update `data-source.ts` to set `synchronize: false` and `migrationsRun: true`.
3. Create `CountryInfo` and `AffiliateInfo` entity files in `src/common/entities/`.
4. Refactor `User` entity file in `src/common/entities/users.entity.ts`.
5. Generate and review custom migration file `src/migrations/1721670000000-UpgradeUserSchema.ts`.
6. Run `npm run build` and `npm run test` to verify `user-service` builds and passes unit tests.

## Open Questions

*(None)*
