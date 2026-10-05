# Changelog

All notable changes to StillUp are documented in this file.

The project follows [Semantic Versioning](https://semver.org/) while it evolves. During the `0.x` phase, minor releases may still contain meaningful internal or API changes.

## [Unreleased]

### Added

- No unreleased changes documented yet.

## [0.1.0]

Initial portfolio release of StillUp.

### Added

- User registration, login, logout, and current-user endpoint.
- JWT authentication stored in an HttpOnly cookie.
- Per-user website and API monitor CRUD.
- `GET` and `HEAD` monitoring.
- Configurable interval, timeout, redirect handling, expected status code, failure threshold, and recovery threshold.
- Scheduled monitor execution through a dedicated background worker.
- Manual monitor checks through the API and frontend.
- Monitor states: `unknown`, `up`, `degraded`, and `down`.
- Persistent monitor check history including response time, status code, and error information.
- Automatic incident opening and resolution based on monitor state.
- Uptime and response-time statistics for `24h`, `7d`, and `30d` periods.
- React dashboard with monitor overview, health state, monitor details, history, incidents, and configuration views.
- FastAPI health endpoint with PostgreSQL and Alembic migration status.
- PostgreSQL persistence with Alembic migrations.
- Docker Compose stack containing frontend, backend, worker, and PostgreSQL services.
- Multi-stage frontend and backend Docker images.
- Nginx SPA serving and `/api/` reverse proxy in the frontend container.
- Container health checks and persistent PostgreSQL volume.
- Backend Pytest suite covering core service, worker, security, schema, and API behavior.
- Frontend lint, type-check, and production-build validation through `npm run check`.
