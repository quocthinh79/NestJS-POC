## ADDED Requirements

### Requirement: TypeORM Migration Pipeline
The `user-service` SHALL disable database schema auto-synchronization (`synchronize: false`) and enable version-controlled migration execution (`migrationsRun: true`), providing NPM CLI scripts for migration generation and execution.

#### Scenario: Running migration CLI commands
- **WHEN** developer runs `npm run migration:generate -- src/migrations/UserMigration`
- **THEN** TypeORM generates a timestamped migration SQL file in `src/migrations/` reflecting entity changes without modifying live tables automatically.

#### Scenario: Production service initialization
- **WHEN** `user-service` starts up in production mode
- **THEN** TypeORM executes all pending migration scripts in `src/migrations/` sequentially before accepting incoming TCP requests.

### Requirement: User Entity Schema
The `user-service` SHALL define the `User` entity with `id` (VARCHAR 255 PK), `prefer_language`, `auth_provider` (`LOCAL`, `GOOGLE`, `FACEBOOK`, `APPLE`), `account_status` (0: Inactive, 1: Active, 2: Banned, 3: Deleted), `theme` (`LIGHT`, `DARK`, `SYSTEM`), `role`, `country_id`, `email`, `password_hash`, `username`, `avatar_url`, `bio`, `last_login_at`, `created_at`, `updated_at`, `two_factor_enabled`, `two_factor_secret`, `password_expired`, `failed_login_attempts`, and `referral_code`.

#### Scenario: Querying user credentials and profile
- **WHEN** authentication service queries user by `email`
- **THEN** TypeORM returns the `User` entity including `password_hash`, `auth_provider`, `account_status`, and relational keys.

### Requirement: Country Reference Data
The `user-service` SHALL define `CountryInfo` entity (`country_id` PK, `country_code`, `currency`) and auto-seed initial reference data (`vi-VN` / `VND`) via database migration.

#### Scenario: Seeding initial country data
- **WHEN** database migrations execute on a fresh or existing database
- **THEN** `COUNTRY_INFO` table is created and populated with standard default country records if not already present.

### Requirement: Affiliate Info Schema
The `user-service` SHALL define `AffiliateInfo` entity (`referral_code` PK, `referred_by`) and establish Foreign Key relation from `USER.referral_code` to `AFFILIATE_INFO.referral_code`.

#### Scenario: Linking user to affiliate referrer
- **WHEN** a user registers with a valid `referral_code`
- **THEN** the Foreign Key constraint verifies `referral_code` exists in `AFFILIATE_INFO`.

### Requirement: Non-Destructive User Migration
The database migration script SHALL add new columns as nullable or with defaults, copy existing `password` data to `password_hash`, assign default values for `theme`, `auth_provider`, `account_status`, `prefer_language`, and only then drop the legacy `password` column.

#### Scenario: Migrating legacy user records
- **WHEN** migration script runs against a database containing legacy user records
- **THEN** legacy `password` hashes are copied to `password_hash`, default columns are populated, and no user accounts are lost.
