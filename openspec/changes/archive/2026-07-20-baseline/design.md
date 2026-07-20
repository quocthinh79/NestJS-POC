## Context

The NestJS-POC project exists as a working proof-of-concept but has no formal specification of its behavior. The "baseline" change introduces OpenSpec capability specs that document the current system as-is. No code changes are involved — this is purely a documentation exercise to establish a foundation for future changes.

The system is a three-tier monorepo: an HTTP API Gateway (NestJS :3001), a TCP User Service microservice (NestJS :4001), and a Next.js frontend (:3000). The gateway proxies requests to the user-service via `@nestjs/microservices` TCP transport.

## Goals / Non-Goals

**Goals:**
- Document all existing system capabilities as testable OpenSpec specs
- Capture the current behavior accurately, including known quirks and inconsistencies
- Establish the spec foundation for all future change proposals
- Enable regression detection when future changes modify behavior

**Non-Goals:**
- Fixing any existing bugs or issues (captured as-is)
- Adding new features or capabilities
- Changing any application source code
- Creating specs for internal implementation details (only external behavior)

## Decisions

### Decision 1: Five capability specs, organized by domain concern
Specs are organized as: `user-authentication`, `user-management`, `post-management`, `api-gateway`, and `authorization`. This mirrors the natural domain boundaries in the codebase.

**Alternative considered:** Organizing by service (api-gateway-spec, user-service-spec). Rejected because capabilities cross service boundaries (e.g., auth involves both gateway and user-service).

### Decision 2: Document behavior as-is, including inconsistencies
Known issues (e.g., `POST /users` not requiring auth, `create_user` not hashing passwords) are documented in the specs as current behavior, not corrected. This gives an honest baseline. Future changes can reference these specs to propose fixes.

**Alternative considered:** Documenting ideal behavior. Rejected because that would create a gap between specs and reality from day one.

### Decision 3: Scenarios as testable contracts
Every requirement includes WHEN/THEN scenarios that can be directly translated to test cases. This makes the specs actionable, not just documentation.

## Risks / Trade-offs

- **[Specs becoming stale]** → Mitigated by using OpenSpec workflow: future changes create delta specs that modify the baseline, keeping specs synchronized with code.
- **[Over-documenting implementation details]** → Mitigated by focusing on external HTTP behavior and guard contracts rather than internal CQRS wiring.
- **[Known bugs documented as requirements]** → Acceptable for a baseline. Future changes will propose fixes with delta specs that modify these requirements.
