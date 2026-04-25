# Project Guidelines

## Product

- This repository builds a private hobby-focused static site.
- Prefer a static-first architecture with React and major libraries.
- Do not add login.
- Add backend or database only when the need is explicit and lightweight.

## Delivery Model

- Work on top of the Plan C baseline: small delivery scope, extension-ready structure.
- Start non-trivial work with a plan-first step before implementation.
- Split oversized work before coding.
- Keep the site releasable while iterating.

## Architecture

- The Vite + React + TypeScript app lives at the repository root.
- App shell and routing live under src/app.
- Seed content and schema validation live under src/content.
- Add new screens under src/pages and keep them aligned with the content model.

## Build And Test

- Install dependencies with npm install.
- Run the dev server with npm run dev.
- Run lint with npm run lint.
- Run unit tests with npm run test.
- Run production build checks with npm run build.

## GitHub Work Tracking

- Use the goal label for a high-level outcome or milestone.
- Use the task label for an implementable unit of work that belongs to one goal.
- Use the plan-first label when a task needs design and impact review before coding.
- Use the auto-implement label only after the plan-first output is accepted.
- Use the blocked label when work cannot proceed without an external decision or dependency.
- Use the knowledge label for improvements to instructions, skills, templates, or reusable learnings.
- Link each task to a single parent goal whenever possible.
- Manage progress in GitHub Projects with the Status field: Todo, In Progress, Done.
- If GitHub Projects access is unavailable in the current session, keep the intended status visible in issue comments and maintain labels accurately.
- Use daily plan issues to record candidate selection, but place implementation requests on the target task issue before assigning it to Copilot.
- Treat the task issue title/body and the latest pre-assignment task issue comment that records the accepted candidate, extra requirements, constraints, and definition of done as the authoritative execution context.
- Keep issue titles, PR titles, and issue comments in Japanese for this repository.
- When a task issue's full scope has been implemented and merged, close the issue with a comment summarising what was implemented. Do not leave task issues open after their work is done.
- When generating a plan-first record or daily plan, verify that any referenced open task issues still represent unimplemented work before treating them as active todos.

## Plan-First Workflow

- Produce a plan-first record before implementation for any task that affects multiple files, changes structure, or carries test risk.
- The plan-first record must cover scope, affected files, risks, tests, and definition of done.
- Ask for confirmation before moving a plan-first task to implementation when the scope or tradeoffs are material.
- Keep the implementation aligned with the accepted plan and update the plan if the scope changes.
- When Copilot is assigned to a task issue, use the issue title/body and existing issue comments as input, respond on the same issue with the plan-first record, then continue through implementation, relevant unit tests, relevant E2E tests, and PR creation unless blocked.

## Testing And PRs

- Link each PR to the goal and task it implements.
- Run unit tests and relevant E2E tests before opening or updating a PR.
- Keep test coverage proportional to the change and protect against regressions.
- Capture meaningful failures, rework, and reusable lessons as repository knowledge.
- After opening a PR for a task started from an assigned issue, request Copilot code review when that feature is available in the current GitHub context.
- Treat PR comments as the place for follow-up requirements and review-driven adjustments after implementation has started.

## Security

- Never commit secrets, personal data, or tokens.
- Keep AI inference tokens separate from repository operation tokens.
- Use least privilege for GitHub automation and widen access only when required.