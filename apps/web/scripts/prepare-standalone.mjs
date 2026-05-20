import { cp, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const standaloneDir = join(root, '.next', 'standalone')

if (!existsSync(standaloneDir)) {
  console.warn('[standalone] .next/standalone not found; skipping asset copy')
  process.exit(0)
}

await mkdir(join(standaloneDir, '.next'), { recursive: true })

const staticDir = join(root, '.next', 'static')
if (existsSync(staticDir)) {
  await cp(staticDir, join(standaloneDir, '.next', 'static'), { recursive: true, force: true })
}

const publicDir = join(root, 'public')
if (existsSync(publicDir)) {
  await cp(publicDir, join(standaloneDir, 'public'), { recursive: true, force: true })
}

console.log('[standalone] copied .next/static and public assets')
