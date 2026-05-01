# Tech Stack - Dev Doctor

## Core
- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Package Manager:** pnpm (Monorepo with workspaces)
- **Execution Profile:** Full (Enterprise)

## Backend / Logic
- **Framework:** Custom Service/Repository Pattern
- **Logging:** Pino + Pino-Pretty
- **Validation:** Zod
- **Shell Commands:** Child Process (Spawn/Exec)
- **File System:** fs-extra

## CLI UI
- **Prompts:** @clack/prompts
- **Styling:** Chalk
- **Loading:** Clack Spinner

## Testing
- **Framework:** Vitest
- **Type Checking:** tsc

## GUI (GitHub Distribution)
- **Framework:** Electron
- **Frontend:** Vanilla HTML5 / JavaScript (ES Modules)
- **Styling:** Tailwind CSS (High Performance)
- **Build Tool:** Vite
- **Communication:** Electron IPC (Inter-Process Communication)

## Core Logic (Shared)
- **Package:** `@ysfbkr/dev-doctor-core`
- **Responsibility:** All cleaning logic, system scanners, and tool checks.
