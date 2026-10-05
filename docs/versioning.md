# Versioning policy

StillUp uses Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
0.2.3
│ │ └─ patch
│ └─── minor
└───── major
```

## During the 0.x phase

The project is still evolving, so `0.x` releases are treated as pre-1.0 versions.

Recommended interpretation:

- `0.1.1` — bug fixes, dependency fixes, documentation corrections, small internal improvements;
- `0.2.0` — a meaningful feature milestone or architecture/API change;
- `1.0.0` — the first version where the public behavior and deployment model are considered stable enough to maintain compatibility intentionally.

## What increments each part

### Patch

Increment PATCH for compatible fixes that do not introduce a major new capability.

Examples:

- fix monitor state calculation;
- fix Docker dependency configuration;
- correct UI behavior;
- update documentation;
- patch a dependency/runtime problem.

### Minor

Increment MINOR for a new feature or meaningful capability.

Examples:

- notification channels;
- public status pages;
- new monitor policy options;
- server-side pagination;
- new statistics/reporting capabilities.

During `0.x`, a minor release can also contain breaking internal/API changes when they are documented clearly.

### Major

After `1.0.0`, increment MAJOR for intentional breaking changes to documented public behavior, API contracts, configuration, or deployment expectations.

## Version locations

When publishing a release, keep these values aligned:

- `frontend/package.json` → `version`;
- backend default version in `backend/src/config/settings.py`;
- `VERSION` in `backend/.env.example`;
- `VERSION` in `backend/.env.docker.example`;
- `CHANGELOG.md`;
- Git tag, for example `v0.2.0`.

Local `.env` files may override the backend version, but repository templates should match the released source version.

## Release checklist

For a normal release:

1. Decide the next version using the rules above.
2. Update version values in the repository.
3. Move completed entries from `Unreleased` into the new section in `CHANGELOG.md`.
4. Run frontend validation:

   ```bash
   cd frontend
   npm run check
   ```

5. Run backend tests:

   ```bash
   cd backend
   pytest
   ```

6. Build the complete Docker stack from a clean state:

   ```bash
   docker compose build --no-cache
   docker compose up
   ```

7. Verify login, monitor creation, scheduled checking, manual checking, statistics, incidents, and health endpoints.
8. Commit the release changes.
9. Create an annotated Git tag:

   ```bash
   git tag -a v0.2.0 -m "StillUp v0.2.0"
   git push origin v0.2.0
   ```

10. Create the corresponding GitHub release using the matching changelog section.

## Changelog format

`CHANGELOG.md` is the source of human-readable release history.

Use sections such as:

```text
Added
Changed
Fixed
Removed
Security
```

Only document changes that matter to a developer, deployer, or user. Avoid turning the changelog into a raw commit log.
