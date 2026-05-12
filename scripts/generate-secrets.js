#!/usr/bin/env node
/**
 * Velkor — Strapi Production Secret Generator
 *
 * Generates cryptographically secure values for all required Strapi env vars.
 * Output is Railway-compatible: paste directly into Railway → Variables.
 *
 * Usage:
 *   node scripts/generate-secrets.js
 *   node scripts/generate-secrets.js --format=shell   # export VAR=value
 *   node scripts/generate-secrets.js --format=dotenv  # VAR=value (default)
 *
 * Requirements: Node.js built-in crypto only — zero external dependencies.
 */

'use strict'

const crypto = require('crypto')

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns a URL-safe base64 string (no padding) from random bytes. */
function randomBase64(bytes) {
  return crypto.randomBytes(bytes).toString('base64url')
}

/** Returns a hex string from random bytes. */
function randomHex(bytes) {
  return crypto.randomBytes(bytes).toString('hex')
}

/** Returns N comma-separated base64url keys for APP_KEYS. */
function generateAppKeys(count) {
  return Array.from({ length: count }, () => randomBase64(32)).join(',')
}

// ── Parse flags ───────────────────────────────────────────────────────────────
const args   = process.argv.slice(2)
const format = (args.find(a => a.startsWith('--format=')) || '').replace('--format=', '') || 'dotenv'

if (!['dotenv', 'shell'].includes(format)) {
  console.error(`Unknown format "${format}". Use: dotenv | shell`)
  process.exit(1)
}

// ── Generate secrets ─────────────────────────────────────────────────────────

const secrets = {
  ADMIN_JWT_SECRET:   randomBase64(32),   // 256-bit  — Strapi admin panel JWT signing
  JWT_SECRET:         randomBase64(32),   // 256-bit  — users-permissions JWT signing
  API_TOKEN_SALT:     randomBase64(24),   // 192-bit  — API token hashing salt
  TRANSFER_TOKEN_SALT: randomBase64(24),  // 192-bit  — transfer token hashing salt
  APP_KEYS:           generateAppKeys(4), // 4 × 256-bit — Koa session encryption
}

// ── Format output ─────────────────────────────────────────────────────────────

const lines = Object.entries(secrets).map(([k, v]) =>
  format === 'shell' ? `export ${k}="${v}"` : `${k}=${v}`
)

const separator = '─'.repeat(64)

console.log()
console.log(separator)
console.log('  Velkor — Generated Strapi secrets')
console.log(`  ${new Date().toISOString()}  |  format: ${format}`)
console.log(separator)
console.log()
lines.forEach(l => console.log(l))
console.log()
console.log(separator)
console.log('  ⚠  SECURITY REMINDERS')
console.log(separator)
console.log('  • Each run generates NEW, unique secrets.')
console.log('  • NEVER commit these values to git.')
console.log('  • NEVER reuse secrets across environments.')
console.log('  • Paste into: Railway Dashboard → Service → Variables')
console.log('  • Also set DATABASE_* and FRONTEND_URL (see .env.example).')
console.log(separator)
console.log()
