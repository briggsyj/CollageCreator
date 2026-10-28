#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-2.0-or-later
# Copyright (C) 2026 John Briggs
#
# Publishes the built site to the `gh-pages` branch, which GitHub Pages serves when the
# repository's Pages source is "Deploy from a branch: gh-pages".
#
#   publish-pages.sh site    <dist>       the main site, at the branch root
#   publish-pages.sh preview <dist> <pr>  a pull request's build, at /pr-preview/pr-<pr>/
#   publish-pages.sh remove  <pr>         take that preview away again
#
# The main site and the previews live side by side: publishing one never touches the other.
# Needs GITHUB_TOKEN (contents: write) and GITHUB_REPOSITORY in the environment.

set -euo pipefail

mode=${1:?mode: site, preview or remove}
dist=""
pr=""
case "$mode" in
  site) dist=${2:?dist directory} ;;
  preview) dist=${2:?dist directory}; pr=${3:?pull request number} ;;
  remove) pr=${2:?pull request number} ;;
  *) echo "unknown mode: $mode" >&2; exit 2 ;;
esac
[ -z "$dist" ] || dist=$(cd "$dist" && pwd)

# PAGES_REMOTE replaces the GitHub address, for trying the script against a local repository.
remote="${PAGES_REMOTE:-https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git}"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

if git ls-remote --exit-code --heads "$remote" gh-pages >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch gh-pages "$remote" "$work"
else
  git init --quiet "$work"
  git -C "$work" checkout --quiet -b gh-pages
  git -C "$work" remote add origin "$remote"
fi
cd "$work"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

case "$mode" in
  site)
    # Replace everything except the git data and the previews.
    find . -mindepth 1 -maxdepth 1 ! -name .git ! -name pr-preview -exec rm -rf {} +
    cp -a "$dist"/. .
    message="Publish the site from ${GITHUB_SHA:-master}"
    ;;
  preview)
    rm -rf "pr-preview/pr-$pr"
    mkdir -p "pr-preview/pr-$pr"
    cp -a "$dist"/. "pr-preview/pr-$pr/"
    # Source maps are for debugging and only make the branch heavier.
    find "pr-preview/pr-$pr" -name '*.map' -delete
    message="Preview of pull request #$pr (${GITHUB_SHA:-head})"
    ;;
  remove)
    rm -rf "pr-preview/pr-$pr"
    message="Remove the preview of pull request #$pr"
    ;;
esac
touch .nojekyll

git add -A
if git diff --cached --quiet; then
  echo "Nothing to publish."
  exit 0
fi
git commit --quiet -m "$message"

# Other publishes can land at the same time; they touch other folders, so a rebase is enough.
for attempt in 1 2 3 4 5 6; do
  if git push --quiet origin HEAD:gh-pages; then
    echo "Published: $message"
    exit 0
  fi
  git pull --quiet --rebase origin gh-pages || true
  sleep $((attempt * 2))
done
echo "Could not publish after several tries." >&2
exit 1
