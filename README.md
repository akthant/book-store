# BookStore Upgrade Notes (Angular 9 -> Angular 17)

This document captures the upgrade journey for this project, key blockers, resolutions, pending work, and lessons learned.

## 1) Upgrade Objective

Primary objective:
- Move the Angular app from v9 to v17 to remove legacy toolchain risk and eliminate the OpenSSL/webpack build failure on modern Node runtimes.

Secondary objectives:
- Keep the existing app behavior and Express integration working.
- Preserve a controlled, major-by-major migration path.
- Document operational and technical lessons for future upgrades.

## 2) High-Level Upgrade Steps Completed

1. Baseline assessment
- Inspected dependencies and build system.
- Confirmed Angular 9 + webpack 4 + TSLint + Protractor legacy stack.

2. Angular major-by-major framework migration
- Upgraded incrementally:
	- 9 -> 10
	- 10 -> 11
	- 11 -> 12
	- 12 -> 13
	- 13 -> 14
	- 14 -> 15
	- 15 -> 16
	- 16 -> 17

3. Angular Material/CDK alignment
- Updated Material/CDK to match framework progression where possible.
- Kept compatibility when strict migration constraints blocked direct jumps.

4. Compile-time and migration fixes
- Accepted and preserved Angular CLI/core schematic changes.
- Updated module-level imports and compatibility-related app code changes created by migration tools.

5. Build validation during and after migration
- Validated build repeatedly after major jumps.
- Confirmed successful build on Angular 17 state.

## 3) Major Issues Faced and How They Were Tackled

### Issue A: ERR_OSSL_EVP_UNSUPPORTED (OpenSSL / webpack hashing)

Symptom:
- Build failed with OpenSSL digital envelope unsupported error.

Root cause:
- Legacy Angular/webpack stack was incompatible with modern Node/OpenSSL defaults.

Resolution:
- Progressed through major Angular versions until modern build tooling was in place.
- Re-validated build after each significant upgrade point.

### Issue B: Temporary Angular CLI updater requiring newer Node patch version

Symptom:
- ng update attempted to install temporary latest CLI and enforced a newer Node patch level.

Resolution:
- Executed migration commands using an ephemeral Node runtime in command scope.
- Continued with controlled, version-specific update commands.

### Issue C: npm cache permission and tar extraction noise

Symptom:
- EPERM cache/file warnings and update interruptions.

Resolution:
- Used local/session cache paths for update/install commands.
- Re-ran commands with force only where transition conflicts were expected during major hops.

### Issue D: Angular Material barrel import and version mismatch

Symptom:
- Template errors such as unknown mat-* elements and router/form binding errors after major jumps.

Root cause:
- Outdated Material import style and temporary version mismatches during migration.

Resolution:
- Replaced deprecated barrel import usage with per-package Material imports.
- Brought CDK/Material versions forward in line with framework state.

### Issue E: Test execution environment constraints

Symptom:
- Karma could not bind to port 9876 in the current sandboxed execution context.

Resolution:
- Classified as environment/sandbox restriction (not a code-level migration failure).
- Build validation remained the primary deterministic signal in this session.

## 4) Current Status Snapshot

Completed:
- Angular core/CLI upgraded to v17.
- Build currently succeeds in upgraded state.
- Multiple migration-generated code/config updates applied successfully.

Partially addressed:
- Angular Material migration toward v17 has legacy component constraints; package compatibility strategy is in place, but full modernization is still pending.

Not completed in this pass:
- Full lint modernization (TSLint -> angular-eslint) is not finalized.
- E2E modernization (Protractor replacement) deferred by plan.
- Final runtime standardization docs/scripts still need completion.

## 5) What Is Left To Be Done

1. Finalize Node runtime policy
- Add and enforce project Node version policy (for example via .nvmrc and engines field).

2. Complete lint modernization
- Replace TSLint workflow with angular-eslint.
- Update lint scripts and CI checks.

3. Resolve Angular Material legacy usage path
- Migrate legacy Material usage to the MDC-compatible path to fully unlock latest Material upgrades.

4. Stabilize unit test execution in local/CI environment
- Ensure Karma/ChromeHeadless port permissions and runner configuration are reliable in target environment.

5. E2E modernization
- Replace Protractor with Playwright or Cypress in a dedicated phase.

6. Clean-up and hardening
- Re-check strict TypeScript/lint baselines.
- Add CI gates for build, test, lint, and Node version compliance.

## 6) Why Token Usage Is High In This Case

Token usage was high because this task combined long-running, high-context activities:

1. Multi-major migration depth
- Migrating across many major versions requires repeated dependency resolution, migration logs, and validations.

2. Extensive terminal output
- npm/ng update/build/test outputs are verbose and include warnings, migration notes, and stack traces.

3. Iterative troubleshooting loops
- Each blocker (runtime, package compatibility, migration constraints, environment restrictions) required additional diagnostic and recovery steps.

4. Large diff and configuration churn
- Framework migrations touch many files and produce broad config/code changes that must be reviewed and validated.

5. Safety-first execution strategy
- Incremental upgrades and frequent verification reduce risk but naturally increase interaction volume.

## 7) Learning Points

### A) From a Front-End Developer Perspective

1. Always align framework and UI library majors
- Angular and Material/CDK should move together to avoid template/module breakages.

2. Prefer official migrations over manual edits
- ng update schematics prevent many hidden regressions.

3. Expect import/path modernization during long upgrades
- Legacy barrels and deprecated APIs will eventually break.

4. Validate after every major step
- Build + unit test checks after each major jump isolate breakpoints and reduce rollback effort.

5. Differentiate code failures from environment failures
- Not all red output means broken code; port/network/runtime constraints can mimic framework failures.

### B) From a Technical Lead Perspective

1. Plan upgrade programs as phased initiatives
- Define scope, acceptance criteria, and deferred items up front.

2. Enforce runtime standards early
- Pin Node/npm versions and define CI runtime compatibility before migration begins.

3. Budget for modernization debt around tooling
- Lint stack and E2E framework migrations are often mandatory companions to framework upgrades.

4. Optimize risk using milestone commits
- One major upgrade per milestone commit improves auditability and rollback confidence.

5. Track migration economics
- Long upgrades consume engineering and token/tooling bandwidth; governance and automation improve cost-efficiency over time.

## 8) Suggested Next Execution Order

1. Finalize runtime policy (.nvmrc + engines + CI node pin).
2. Migrate lint to angular-eslint.
3. Complete Material legacy-to-MDC migration.
4. Re-run build + unit tests in non-restricted environment.
5. Replace Protractor in a dedicated follow-up track.

---

If needed, this document can be split into two files next:
- Technical migration runbook (command-level reproducibility)
- Leadership retrospective (risks, cost, timeline, and governance outcomes)
