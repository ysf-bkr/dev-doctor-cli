# Base Project — Gemini-CLI-Extensions-Framework
# Place in project root. This file is the single source of truth for Base Project AI Extensions.

## 🎖️ AGENT CHECKLIST (MANDATORY BEFORE RESPONSE)
> Check this list at the end of every response:
> - [ ] **Zero Mock:** Did you use fake data or placeholders? (Strictly Forbidden)
> - [ ] **Contract First:** Are `shared-types` and `contract.version.json` up to date?
> - [ ] **Audit Log:** Did you log this action in `.gemini/logs/[agent].json`?
> - [ ] **CLI Orchestration:** Does the action comply with `gemini cli` rules?
> - [ ] **No "..." allowed:** Did you write the code completely without omitting parts?

---

## Constitution Status
This file (`./GEMINI.md`) and the `.gemini/docs/` folder represent the "Supreme Law" of the project. All agents must read this file first in every session and strictly comply with its rules 100%.

---

## STEP 0 — STARTUP (EVERY SESSION, NON-NEGOTIABLE)

1. **Read ./GEMINI.md First:** Read and fully understand this file before taking any action.
2. **Read LLM-Wiki (Memory):** Read `.gemini/wiki/PROJECT_CONTEXT.md` and `.gemini/wiki/CONVERSATION_HISTORY.md` to remember past chats and the project's current state.
3. **Check `.gemini/docs/` Folder:** Verify the existence of the `.gemini/docs/` folder in the project root.
4. **Absorb Context:** Read `.gemini/docs/tech-stack.md`. If it is empty, ask the user to fill it before proceeding.
5. **Demand Context:** If the `.gemini/docs/` folder does not exist, ask the user for project context and target audience information before writing any code.
6. Default Frontend: React 19 + Vite (SPA) + react-router-dom (User Preference)

**NEVER SKIP THIS STEP.** Do not assume context; read first, then act.

---

## LLM-WIKI & PERSISTENT MEMORY PROTOCOL

- **Memory Initialization:** All agents, particularly `@team-lead`, MUST read the `.gemini/wiki/` directory at the start of any task.
- **Conversation Logging:** At the end of every conversation or major task, the active agent (usually `@team-lead`) MUST append a brief summary to `.gemini/wiki/CONVERSATION_HISTORY.md` detailing what was accomplished and what the next steps are.
- **Architecture Decisions:** Any new architectural choices or stack updates MUST be logged into `.gemini/wiki/ARCHITECTURE_DECISIONS.md`.
- **Project Context:** Ensure `.gemini/wiki/PROJECT_CONTEXT.md` accurately reflects the current high-level state of the project.

---

## CORE PRINCIPLES

- **Team-Lead Default Orchestration:** Whenever the user writes a general request, the `@team-lead` agent MUST automatically step in. The Team Lead is responsible for analyzing the user's intent, determining the Execution Profile (Lightweight or Full), and delegating tasks to the appropriate specialist agents.
- **Contract-First Approach:** Communication between Backend and Frontend must always be defined via schemas first. `packages/shared-types/contract.version.json` dosyası MAJOR.MINOR formatında tutulmalı ve her değişiklikte güncellenmelidir. Bu dosyanın güncellenmesinden `@backend-architect` sorumludur.
- **Zero Mock Policy:** Sahte (mock) veri veya yer tutucu kullanımı kesinlikle yasaktır. Her kod satırı gerçek bir uç noktaya veya tiplendirilmiş bir kontrata bağlanmalıdır. (İstisna: Stripe, Twilio gibi harici 3. taraf servisler için kontrollü mock kullanımına izin verilir).
- **Branded Types Law:** Tüm ID'ler (UserID, ProjectID, vb.) `packages/shared-types` altında tanımlanan "Branded Types" formatında olmalıdır. Düz string veya number kullanımı yasaktır.
- **CLI-First Policy:** AI CLI Assistant odağı nedeniyle, tüm çıktılar kullanıcı dostu (Chalk, Clack vb. ile) ve stream tabanlı olmalıdır. Tüm komutlar `--output json` flag'ini desteklemeli ve makine tarafından okunabilir çıktı üretebilmelidir.
- **Audit Logging Necessity:** Every critical action must be logged traceably under the `.gemini/logs/` folder.
- **File Ownership Rule:** Each file is the responsibility of a single agent.
- **CLI Command Mapping:** Projedeki tüm CLI komutları `.gemini/cli-commands.json` dosyasında tanımlanmalı ve ilgili ajana atanmalıdır.
- **Exit Code Standard:** Hata durumlarında standart exit kodları (örn. 64: Kullanıcı Hatası, 70: İç Hata) kullanılmalıdır.
- **Phase-Based Execution:** The development process must progress through defined Phases. You cannot move to the next phase until the current one is completed.
- **CLI-Driven Orchestration:** All agent interactions and task delegations must be traceable via `gemini cli`.
- **Monorepo Discipline:** Komutlar her zaman monorepo kök dizininden pnpm/turbo kullanılarak (ör: `pnpm --filter web dev`) çalıştırılmalıdır.

---

## STEP 1 — VALIDATE BEFORE ACTING

Before writing any code or design, check `.gemini/docs/tech-stack.md`:

| Unknown | Action |
|---|---|
| Target Audience | Ask — do not proceed |
| Platform (web / mobile / desktop / backend) | Ask — do not proceed |
| **Technology Stack** | **Check `.gemini/docs/tech-stack.md` → If missing → ASK** |
| **Execution Profile (Full / Lightweight)** | **Ask — do not proceed** |
| Database (MariaDB / SQLite / PostgreSQL) | Ask — do not proceed |
| Environment (prototype / production) | Ask — do not proceed |
| Auth required? | Ask — do not proceed |
| Monorepo or separate repos? | Ask — do not proceed |
| Deploy target (Vercel / Docker / Bare metal)? | Ask — do not proceed |
| i18n (multi-language) required? | Ask — do not proceed |
| API versioning strategy? | Ask — do not proceed |
| Accessibility level (WCAG AA / AAA)? | Default AA — ask if different |
| Scope too broad ("build the whole app") | Break into parts → confirm each part |

Small details (port, filename, folder name) → assume and state them.

Always write assumptions at the top of your response:
```
Assumption: [what] — [why]
```

---

## OUTPUT FLOWS (MANDATORY STANDARDS)

Every agent must use the **Mandatory Output Flow** defined in their specific `.md` file. However, the following sections are mandatory in all outputs:

- **Assumptions:** All assumptions made.
- **Problem:** What is being built and why (Max 2-3 sentences).
- **File Tree:** Complete folder and file structure.
- **Code:** Complete code content (using "..." is forbidden).
- **Audit Logging:** How the changes are logged.
- **Tests:** Test file for every service and utility.

---

## ABSOLUTE DON'TS — APPLIES TO EVERY RESPONSE

- **`any` Type is Forbidden:** The use of `any` is strictly forbidden in TypeScript projects.
- **`console.log` is Forbidden:** `console.log` cannot be present in production code.
- **Mock Data is Forbidden:** Sahte (mock) veri veya yer tutucu kullanımı kesinlikle yasaktır. Her kod satırı gerçek bir uç noktaya veya tiplendirilmiş bir kontrata bağlanmalıdır. (İstisna: Stripe, Twilio gibi harici 3. taraf servisler için kontrollü mock kullanımına izin verilir).
- **File Ownership Violation:** Making unauthorized changes in files outside your scope is forbidden.
- **Security Rule Violation:** Violating security protocols is strictly forbidden.
- **Hardcoded Secrets:** Embedding API keys or env variables inside the code is forbidden.
- **Raw SQL Strings:** Direct strings cannot be used for SQL queries; strictly use `Kysely`.
- **Direct DB call in a controller:** Database operations cannot be performed directly inside a Controller.
- **Missing try/catch on async operations:** Error handling (try/catch) is mandatory for asynchronous operations.

---

## LANGUAGE POLICY

- Code comments: Turkish (Neden yapıldığını açıkla, ne yapıldığını değil).
- Variable / function / class / file names: English.
- User-facing UI text: Turkish (Default).
- Communication: Turkish by default (Global rule).

---

## EXECUTION PROFILES

Depending on the size and complexity of the project, there are two execution profiles. The Team Lead must determine this profile at the start of the project:

- **Lightweight Profile (MVP):** Only `team-lead`, `backend-architect`, `frontend-specialist`, and `design-specialist` are active. Mandatory for rapid prototyping, small projects, and low-budget work. Mobile, desktop, and test agents are bypassed.
- **Full Profile (Enterprise):** team-lead, backend-architect, frontend-specialist, design-specialist, test-engineer

---

## API & CONTRACT MANAGEMENT

### 1. contract.version.json Standard
This file is the single source of truth for API stability. `@backend-architect` is responsible for its integrity.

```json
{
  "version": "MAJOR.MINOR",
  "last_updated": "ISO-8601",
  "contract_hash": "sha256-hash-of-shared-types",
  "breaking_changes": [
    { "version": "1.0", "description": "Initial stable release" }
  ],
  "deprecated_versions": []
}
```
- **MAJOR:** Incremented on breaking changes (Phase Rollback required).
- **MINOR:** Incremented on additive changes (New fields/endpoints).

---

## STATE MACHINE & EXECUTION PHASES

The development process follows a strict State Machine. Transition to the next phase is prohibited until the "Success Criteria" of the current phase is met.

- **[STATE: PHASE_0] Discovery & Setup:** Profile selection (Lightweight/Full), requirement analysis, and validating `.gemini/docs/tech-stack.md`.
- **[STATE: PHASE_1] Architecture & Contracts:** Setup of data models, API schemas, and `packages/shared-types`. Cannot proceed until Frontend and Backend approve these schemas.
- **[STATE: PHASE_2] Core Development:** Active agents build core features in parallel based on the selected profile. (Under the apps/ folder)
- **[STATE: PHASE_3] Integration & Testing:** System integration.
- **[STATE: PHASE_4] Optimization & Deployment:** Performance audit and deployment.

**Rollback Rule:** If a missing field or error is detected in the API schema (`shared-types`) during Phase 2 or later, the system immediately transitions to `[STATE: ROLLBACK_PHASE_1]`. All relevant agents stop their processes, switch to `WAITING` state, and cannot return to Phase 2 until the `backend-architect` resolves the issues.

---

## AGENT TIMEOUT & ESCALATION

Every agent must produce a response for their assigned task within a maximum of 30 minutes (or the time defined per project). Upon timeout, `task-specialist` automatically moves the relevant task to `BLOCKED` status and leaves an escalation message for the `@team-lead`.

---

## CLI STANDARDS & CONFIGURATION

### 1. CLI Command Map (`.gemini/cli-commands.json`)
Tüm CLI komutları bu dosyada merkezi olarak yönetilir. Her komutun sahibi olan bir ajan belirlenmelidir.

### 2. Configuration (`.gemini/config.json`)
CLI davranışları (logLevel, outputFormat, defaultProfile) bu dosya üzerinden yönetilir.

**Priority Rule:** CLI Flags > `.gemini/config.json` > `.env` > Default Values.

### 3. Exit Codes
- `0`: Başarılı
- `64`: Kullanıcı Hatası (Yanlış argüman, eksik parametre)
- `70`: İç Hata (Yazılımsal hata, crash)
- `71`: Bağlantı/Network Hatası

---

## API VERSIONING STRATEGY

All APIs are versioned via the URL path (`/api/v1/...`). The `packages/shared-types/contract.version.json` file uses the MAJOR.MINOR format, ve her değişiklikte güncellenmelidir. `@backend-architect` bu dosyanın doğruluğundan sorumludur. MAJOR versiyon her yıkıcı (breaking) değişiklikte artırılır. Eski versiyonlar en az 1 MAJOR sürüm boyunca desteklenmeye devam eder.

---

## PARALLEL EXECUTION & COORDINATION RULES

1. **Shared-Types as Source of Truth:** All agents reference `packages/shared-types` and the `contract.version.json` file.
2. **Commit-Level Logging:** Every agent must log every atomic change to the `.gemini/logs/[agent-name].json` file.
3. **Implicit Dependency Lock:** If an agent's required output is not ready, it switches to `WAITING` state.
4. **Ownership Enforcement:** Changes to files outside an agent's scope cannot be made without `@team-lead` approval.
5. **No Blind Coding:** Agents must periodically read `.gemini/logs/` and `.gemini/STATUS.md`.
6. **Agent Directives (Message Queue):** `.gemini/messages/` is used for inter-agent communication. 
   - **Message Queue Lock Protocol:** Before writing to a file, check for `.gemini/messages/.lock`.
   - If it exists, wait 500ms and retry (max 3 retries).
   - If lock persists after 3 retries, the agent MUST assume a **stale lock**, delete it, and notify `@team-lead` in their log.
   - Delete `.lock` and the message file immediately after processing.
7. **Phase Rollback Protocol:** If contracts are insufficient, return to Phase 1. All agents become `WAITING` and write `CONTRACT_CHANGED` to their log.
8. **Next.js Ownership Rule:** `apps/web/api/` ve `server/actions/` -> @backend-architect. `apps/web/(routes)/` ve `components/` -> @frontend-specialist.
9. **Zero Mock Test Policy:** Entegrasyon testleri için Docker (TestContainers) üzerinden gerçek veritabanı kullanımı zorunludur.
