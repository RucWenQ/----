# Aliyun ECS Automatic Deployment Design

## Goal

Publish the VitePress site automatically after a successful push to `main`, while keeping the current site available during uploads and retaining a direct rollback path.

## Scope

The first version adds a GitHub Actions workflow, a server-side activation script, and one-time operator instructions. It deploys only the generated `docs/.vitepress/dist/` directory. It does not change VitePress configuration, DNS, TLS certificates, firewall rules, or the existing Nginx virtual host automatically.

Historical releases are not deleted automatically in the first version. This avoids placing recursive cleanup in the unattended deployment path; retention can be added after the actual server root and storage policy are confirmed.

## Architecture

1. A push to `main`, or a manual `workflow_dispatch`, starts the GitHub Actions workflow.
2. The runner checks out the exact commit, installs the locked npm dependencies, and runs `npm run build`.
3. The workflow validates all deployment variables before using them in shell commands.
4. `rsync` uploads `docs/.vitepress/dist/` to a commit-specific directory under `<deploy-root>/releases/<40-character-commit-sha>/`.
5. A repository-owned activation script verifies that the release is inside the configured root and contains `index.html` and `404.html`.
6. The script records the previous `current` target, atomically switches the `current` symlink to the new release, and performs an HTTP health check.
7. If the health check fails, the script atomically restores the previous symlink and exits non-zero, making the GitHub job fail.
8. Nginx serves `<deploy-root>/current` and therefore never serves a half-uploaded release.

## Repository Files

- `.github/workflows/deploy-aliyun-ecs.yml`: build, connection setup, upload, activation, and concurrency control.
- `ops/deploy/activate-release.sh`: path validation, atomic activation, health check, and rollback.
- `ops/deploy/README.md`: one-time ECS/Nginx setup, GitHub Secrets/Variables, first deployment, rollback, and troubleshooting.

## GitHub Configuration

The workflow uses a protected `production` environment and reads:

### Environment secrets

- `ALIYUN_SSH_PRIVATE_KEY`: private key for the restricted deployment user.
- `ALIYUN_KNOWN_HOSTS`: trusted SSH host-key line collected and checked by the operator before it is saved.

### Repository or environment variables

- `ALIYUN_HOST`: ECS public hostname or IP address.
- `ALIYUN_PORT`: SSH port; normally `22`.
- `ALIYUN_USER`: non-root deployment account.
- `ALIYUN_DEPLOY_ROOT`: absolute site root, recommended `/var/www/psy-tutorial`.
- `DEPLOY_HEALTHCHECK_URL`: public HTTPS URL expected to return a successful response.

No secret is printed or stored in the repository. The workflow uses native OpenSSH and rsync rather than a third-party deployment action.

## Server Layout and Permissions

Recommended layout:

```text
/var/www/psy-tutorial/
├── current -> releases/<commit-sha>
├── releases/
│   └── <commit-sha>/
└── bin/
    └── activate-release.sh
```

The deployment user owns this tree but does not run Nginx and does not receive passwordless sudo. Nginx only needs read/traverse permission. The SSH key is dedicated to this deployment account.

The existing Nginx virtual host is changed once to use:

```nginx
root /var/www/psy-tutorial/current;
index index.html;

location / {
    try_files $uri $uri.html $uri/ =404;
}

error_page 404 /404.html;
```

The exact root is replaced if the current server uses another approved location. Content-only deployments do not reload Nginx.

## Safety Rules

- Only `main` and manual dispatch may deploy production.
- One concurrency group serializes production deployments; a newer run does not interrupt an activation already in progress.
- The deploy root must be an absolute path under `/var/www/`, must not contain whitespace, quotes, `..`, or shell metacharacters, and must not equal `/var/www` itself.
- A release identifier must be exactly 40 lowercase hexadecimal characters.
- Upload and activation target only `<validated-root>/releases/<validated-sha>`.
- Strict SSH host-key checking is mandatory; the workflow never calls `ssh-keyscan` and trusts the result automatically.
- Activation requires both `index.html` and `404.html` before switching.
- Failure after switching restores the previous `current` target when one exists.
- The workflow never deletes an existing release.

## Failure Handling

- Build failure: nothing is uploaded.
- Authentication or network failure: the active site is unchanged.
- Partial rsync: activation is not run, so the active site is unchanged.
- Missing required output: activation exits before switching.
- Health-check failure: the previous symlink is restored and the job fails.
- First deployment health-check failure: `current` is removed because no previous release exists; Nginx must continue serving the pre-existing root until the operator deliberately changes it to `current` after a successful dry run.

For that reason, the initial rollout is two-stage: deploy once with Nginx still serving the old directory, inspect the release, then update Nginx to `current` and perform a second manual workflow run.

## Verification

Repository verification:

- Parse the workflow as YAML.
- Run a shell syntax check on `activate-release.sh`.
- Exercise activation in a temporary directory with a local HTTP server: success switches `current`; a failed health check restores the previous target.
- Run `npm ci` and `npm run build`.
- Confirm `git diff --check` and ensure the deployment archive remains untracked.

Production verification:

- Confirm the workflow log identifies the deployed commit.
- Confirm the public site returns HTTP success and contains content from that commit.
- Confirm `readlink -f <deploy-root>/current` points to the expected release.
- Perform one deliberate manual rollback rehearsal before relying on the pipeline unattended.

## Rollout Decision

This design keeps the existing ECS/Nginx hosting model and adds automation around it. Moving the site to Alibaba Cloud OSS and CDN remains a later option, not part of this change.
