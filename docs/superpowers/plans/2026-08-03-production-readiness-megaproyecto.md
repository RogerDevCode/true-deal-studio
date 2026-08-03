# STAX Megaproyecto Production-Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current local healthy rebuild into evidence-backed production readiness without weakening tests,
removing RLS, exposing databases, or treating a local container as a VPS approval.

**Architecture:** STAX Web remains a static entry point. VoiceLive and VentaMax retain independent Compose stacks,
PostgreSQL volumes, roles, RLS policies, migrations and recovery drills. Production approval is split into code/data
evidence that can be executed locally and infrastructure evidence that requires the eventual VPS and DNS authority.

**Tech Stack:** Docker Compose, PostgreSQL 18 + pgvector, Alembic, Drizzle, FastAPI, Next.js, Playwright, Ruff,
Vitest, pg_dump and pg_restore.

## Global Constraints

- Do not use `down --volumes`, reset databases, alter secrets, DNS, tunnels or external OAuth without explicit authority.
- Keep VoiceLive and VentaMax databases, credentials, images and Docker networks independent.
- Do not lower coverage, skip tests, delete assertions, add broad mocks or disable RLS to get green.
- A successful healthcheck proves process availability only; data isolation, recovery and external deployment require
  their own evidence.
- Never place secrets, backups, tokens, database URLs or customer data in Git or reports.

---

### Task 1: Re-establish deterministic local code gates

**Files:**
- Modify only files that the format/lint tools explicitly report.
- Update: `docs/qa/2026-08-03-red-team-frontend-report.md`

- [ ] Run `make backend-format-check`, `make backend-lint`, `make backend-typecheck`, backend tests, and VoiceLive
  frontend format/type/test/build. Install only development dependencies declared in `backend/requirements-dev.txt`.
- [ ] Apply `ruff format` only to exact files reported by the check; run it again and commit the formatting separately.
- [ ] Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` for VentaMax with its documented local test
  environment; failures caused by missing test-DB configuration remain blocking, not ignored.
- [ ] Run STAX `npm run qa:gate` alone, after removing stale Playwright processes through their owning test command.

### Task 2: Execute live database security gates without changing data

**Files:**
- Read: `voicelive-v2/scripts/verify_db_security.py`, `test_db_security_live.py`
- Read: `venta-max-ia/scripts/verify-db-security.mjs`, `test-db-security-live.mjs`

- [ ] Run the inventory/security verifier for each active Compose stack through its restricted runtime roles.
- [ ] Run the live bypass tests: wrong tenant context, missing tenant context, cross-tenant read/write, DDL denial,
  denied role escalation and pgvector isolation.
- [ ] Verify that no database port is published beyond the Docker internal network in the production Compose files.
- [ ] If a verifier fails, correct only the migration, role grant or policy that proves the failure; add a negative
  regression test and rerun the verifier.

### Task 3: Prove backup and restore recovery

**Files:**
- Read/run: `voicelive-v2/scripts/backup_postgres.sh`, `verify_backup.sh`, `backup_restore_drill.sh`
- Read/run: `venta-max-ia/scripts/backup-postgres.sh`, `verify-backup.sh`, `backup-restore-drill.sh`

- [ ] Produce a backup with a dedicated backup role, checksum and `0600` permissions.
- [ ] Verify the archive can be listed without restoring it.
- [ ] Restore each archive into the script-defined temporary database, compare manifests and ensure cleanup removes only
  the generated drill database.
- [ ] Record pass/fail, duration and artifact location without recording dump names containing sensitive paths.

### Task 4: Rebuild and smoke-test from the checked source

**Files:**
- Update: `docs/qa/2026-08-03-red-team-frontend-report.md`

- [ ] Rebuild each Compose stack with `build --pull`; stop/restart without volumes.
- [ ] Require migrations to exit `0`, every long-running service to be healthy and the public health endpoint to return
  success.
- [ ] Smoke VoiceLive public preview: require `200`, `Cache-Control: no-store`, a brand name, and absence of WhatsApp
  and session token before consent.
- [ ] Smoke STAX local fallback and VentaMax health without creating data.

### Task 5: Issue the production evidence verdict

**Files:**
- Update: `docs/qa/2026-08-03-red-team-frontend-report.md`
- Update: `docs/manuales/MANUAL-ADMINISTRADOR-STAX.md` only if the exact VPS handoff procedure changes.

- [ ] Mark each local gate as PASS, FAIL or BLOCKED with the command and direct evidence.
- [ ] Keep `NO APROBADO PARA PRODUCCIÓN` until the target VPS has: a secret manager, HTTPS certificates, restricted
  firewall, off-host encrypted backup retention, monitoring/alerts, restore drill, DNS/tunnel verification and a
  named operator. These cannot be inferred from this workstation.
- [ ] Commit only documentation and code changes produced by verified gates; do not push without explicit approval.
