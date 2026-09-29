#!/usr/bin/env bash
set -euo pipefail

root="${1:?deploy root is required}"
release="${2:?release sha is required}"
health_url="${3:?health URL is required}"

if [[ ! "$root" =~ ^/var/www/[A-Za-z0-9._/-]+$ || "$root" == "/var/www" || "$root" == *..* ]]; then
  echo "invalid deploy root" >&2
  exit 2
fi
if [[ ! "$release" =~ ^[0-9a-f]{40}$ ]]; then
  echo "invalid release id" >&2
  exit 2
fi
if [[ ! "$health_url" =~ ^https://[^[:space:]]+$ ]]; then
  echo "invalid health URL" >&2
  exit 2
fi

release_dir="$root/releases/$release"
current="$root/current"
previous=""
if [[ -L "$current" ]]; then previous="$(readlink -f "$current")"; fi
[[ -f "$release_dir/site/index.html" && -f "$release_dir/site/404.html" ]] || { echo "release is incomplete" >&2; exit 3; }
[[ -f "$release_dir/app/server/index.mjs" ]] || { echo "workbench server is missing" >&2; exit 3; }

ln -sfn "$release_dir" "$root/.current-$release"
mv -Tf "$root/.current-$release" "$current"

sudo -n systemctl restart psy-research-workbench

if ! curl --fail --silent --show-error --location --max-time 20 "$health_url" >/dev/null; then
  if [[ -n "$previous" ]]; then ln -sfn "$previous" "$root/.current-rollback"; mv -Tf "$root/.current-rollback" "$current"; else rm -f "$current"; fi
  sudo -n systemctl restart psy-research-workbench || true
  echo "health check failed; previous release restored" >&2
  exit 4
fi

echo "activated $release"
