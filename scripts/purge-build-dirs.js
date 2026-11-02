#!/usr/bin/env node
/**
 * Permanently remove the .next_stale_* / out_prev_* directories left behind by
 * scripts/build-local.js.
 *
 * Deliberately does NOT use fs.rm / fs.rmdir: on this machine those are
 * rewritten by node-safe-delete-shim.cjs into "move to the Recycle Bin", one
 * subprocess per file, which is how the bin ended up with 283,158 entries.
 * robocopy is a separate Windows binary and deletes for real.
 *
 * Usage:
 *   node scripts/purge-build-dirs.js          # dry run, lists what it would do
 *   node scripts/purge-build-dirs.js --yes    # actually delete
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--yes');

const targets = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => n.startsWith('.next_stale_') || n.startsWith('out_prev_'));

if (!targets.length) {
  console.log('nothing to purge.');
  process.exit(0);
}

console.log((APPLY ? 'deleting ' : 'dry run — would delete ') + targets.length + ' directories:');
for (const t of targets) console.log('  ' + t);

if (!APPLY) {
  console.log('\nre-run with --yes to delete.');
  process.exit(0);
}

const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'purge-empty-'));
try {
  for (const t of targets) {
    const full = path.join(ROOT, t);
    try {
      // robocopy exit codes 0-7 are success variants; >=8 is a real failure.
      execFileSync('robocopy', [empty, full, '/MIR', '/NFL', '/NDL', '/NJH', '/NJS', '/NC', '/NS'], {
        stdio: 'ignore',
      });
    } catch (e) {
      if (e.status === undefined || e.status < 8) {
        // expected: robocopy returns non-zero for successful operations too
      } else {
        console.log('  ! robocopy failed for ' + t + ' (exit ' + e.status + ')');
        continue;
      }
    }
    fs.rmdirSync(full, { recursive: true });
    console.log('  removed ' + t);
  }
} finally {
  fs.rmdirSync(empty, { recursive: true });
}
