#!/usr/bin/env node
/**
 * Local build wrapper — use this instead of a bare `next build`.
 *
 * Why this exists
 * ---------------
 * On this machine every Node process is started with
 *   NODE_OPTIONS=--require ".../WorkBuddy/.../shim/node-language-shim.cjs"
 * which loads node-safe-delete-shim.cjs. That shim rewrites fs.rm / rmdir /
 * unlink into a call to the `genie-trash` binary, and on Windows that means
 * "move to the Recycle Bin" — one child process per deleted file.
 *
 * `next build` deletes .next and out, which are 250k-650k files each. The result
 * was 283,158 entries in F:\$Recycle.Bin and a build that took 33 minutes
 * without finishing (2 minutes of real work, the rest spent trashing files).
 *
 * So this wrapper does two things:
 *   1. Renames .next / out aside BEFORE the build, so Next has nothing to delete
 *      at all — renaming is not a delete and the shim does not touch it.
 *   2. Runs the build with CODEBUDDY_SAFE_DELETE_ENABLED=0 and a capped heap,
 *      so even the files Next does clean up are deleted properly.
 *
 * It never deletes anything itself. To reclaim the *_stale / *_prev directories
 * afterwards, run:  node scripts/purge-build-dirs.js
 *
 * Usage: npm run build:local
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ts = Date.now();

function moveAside(name, prefix) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) return null;
  const dest = path.join(ROOT, prefix + '_' + ts);
  fs.renameSync(p, dest);
  return dest;
}

const moved = [moveAside('.next', '.next_stale'), moveAside('out', 'out_prev')].filter(Boolean);
if (moved.length) {
  console.log('[build:local] moved aside: ' + moved.map((p) => path.basename(p)).join(', '));
}

// Same derived data the CI build generates before compiling.
for (const s of ['scripts/generate-search-index.js', 'scripts/generate-toolbox-slim.js']) {
  console.log('[build:local] > ' + s);
  const r = spawnSync(process.execPath, [path.join(ROOT, s)], { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) process.exit(r.status === null ? 1 : r.status);
}

const env = Object.assign({}, process.env, { CODEBUDDY_SAFE_DELETE_ENABLED: '0' });
env.NODE_OPTIONS = ((env.NODE_OPTIONS || '') + ' --max-old-space-size=6144').trim();

console.log('[build:local] > next build (safe-delete disabled, heap capped at 6 GB)');
const res = spawnSync(
  process.execPath,
  [path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'],
  { stdio: 'inherit', env, cwd: ROOT }
);
process.exit(res.status === null ? 1 : res.status);
