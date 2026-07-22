## Why

The current `user-service` database uses a simplistic legacy schema (`User` with only basic fields: `id`, `name`, `username`, `email`, `password`, `role`, `createdAt`) and relies on TypeORM auto-synchronization (`synchronize: true`). This lack of schema versioning, audit tracking, multi-provider auth metadata, 2FA, and localization support prevents production deployment and risks data corruption on database restarts.

## What Changes

* **TypeORM Migration System**: Disable runtime schema synchronization (`synchronize: false`) and enable versioned CLI database migrations (`migrationsRun: true`).
* **User Schema Refactoring**: Upgrade `User` entity to support OAuth providers (`LOCAL`, `GOOGLE`, `FACEBOOK`, `APPLE`), account status flags, theme preferences (`LIGHT`, `DARK`, `SYSTEM`), 2FA fields, failure attempt counters, and referral codes.
* **New Database Entities**: Add `CountryInfo` (`country_id`, `country_code`, `currency`) and `AffiliateInfo` (`referral_code`, `referred_by`) entities with Foreign Key relations to `User`.
* **Data Seeding**: Automate reference data seeding for `COUNTRY_INFO` during migration.
* **Non-Destructive Backfill**: Execute 2-phase migration to copy existing `password` data into `password_hash` and assign default enums before dropping legacy columns.
* **BREAKING**: Replaced `password` column with `password_hash` in `User` entity and database schema.

## Capabilities

### New Capabilities
- `user-db-schema-migration`: Database entities, MySQL enum types, TypeORM CLI migration pipeline, reference seeding, and non-destructive data backfilling.

### Modified Capabilities
*(None)*

## Impact

- `backend/user-service/src/common/entities/users.entity.ts`: Updated entity definition with new columns and relations.
- `backend/user-service/src/common/entities/country-info.entity.ts`: New entity file for country reference data.
- `backend/user-service/src/common/entities/affiliate-info.entity.ts`: New entity file for affiliate tracking.
- `backend/user-service/src/data-source.ts`: TypeORM configuration update (disable sync, configure migrations path).
- `backend/user-service/package.json`: NPM scripts for `typeorm migration:generate` and `typeorm migration:run`.
- `backend/user-service/src/migrations/`: Generated versioned SQL migration and seed files.
