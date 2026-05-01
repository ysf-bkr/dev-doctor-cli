# Project Context

## Project Description
Dev Doctor is a professional, high-performance CLI utility designed to diagnose, clean, and optimize developer environments. It handles system bloat across various ecosystems (Node, Docker, Git, etc.) with a focus on speed and ease of use.

## Target Audience
Software Developers and DevOps Engineers.

## Core Tech Stack
- TypeScript (ESM)
- @clack/prompts (Interactive UI)
- Boxen & Gradient String (Advanced Styling)
- Pino (Logging)
- Zod (Validation)

## Current Phase
[STATE: COMPLETED] v0.3.0 Stable CLI Release

## Active Goals
- Maintain a single, powerful CLI tool.
- Optimize disk scanning performance.
- Expand "Doctor" suite diagnostic rules.

## Current State & Blockers
Project has been simplified from a monorepo to a single-package CLI for better maintainability and performance.

## Known Bugs & Issues
- None reported in v0.3.0.

## Lessons Learned & Mistakes to Avoid
- Keep architecture simple unless multi-platform distribution is strictly required.
- Standardize on ESM for modern Node.js support.
