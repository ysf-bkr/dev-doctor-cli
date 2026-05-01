# Architecture Decisions

## [AD-001] Transition to Monorepo (v0.2.1)
- **Status:** Accepted
- **Context:** The project was a single-package CLI. To comply with `GEMINI.md` standards and allow for future expansion (like a web dashboard or shared core logic), a monorepo structure is required.
- **Decision:** Use `pnpm` workspaces with `apps/` and `packages/` folders.
- **Consequences:**
    - Strict separation of types in `packages/shared-types`.
    - Improved scalability.
    - Requires `pnpm` for development.

## [AD-002] Enhanced Self-Clean Protection
- **Status:** Accepted
- **Context:** The previous protection was too broad, potentially skipping valid cleaning targets.
- **Decision:** Protect only the current working directory, app executable path, and critical user config folders (`.ssh`, `.gnupg`).
- **Consequences:** Safer and more targeted cleaning.
