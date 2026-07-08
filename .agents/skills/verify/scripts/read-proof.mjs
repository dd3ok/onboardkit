#!/usr/bin/env node
import fs from 'node:fs';
const file = process.argv[2];
if (!file) {
  console.error('usage: node read-proof.mjs <proof.json>');
  process.exit(1);
}
const proof = JSON.parse(fs.readFileSync(file, 'utf8'));
console.log(JSON.stringify({ criterion_id: proof.criterion_id, ok: proof.ok, exit_code: proof.exit_code, fresh: proof.fresh }, null, 2));
