import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const root = process.cwd()
const port = process.env.PORT || '3000'
const hostname = process.env.HOSTNAME || '0.0.0.0'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const standaloneCandidates = [
  join(root, '.next', 'standalone', 'server.js'),
  join(root, '.next', 'standalone', 'apps', 'web', 'server.js'),
  join(root, 'server.js'),
]

function findStandaloneServer() {
  return standaloneCandidates.find(candidate => existsSync(candidate))
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: process.env,
      ...options,
    })

    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function ensureBuildIfMissing() {
  if (existsSync(join(root, '.next', 'BUILD_ID')) || findStandaloneServer()) return

  console.warn('[start-web] Next build artifacts not found; building before start')
  await run(npmCmd, ['run', 'build'])
}

async function start() {
  await ensureBuildIfMissing()

  const standaloneServer = findStandaloneServer()
  if (standaloneServer) {
    console.log(`[start-web] starting standalone server: ${standaloneServer}`)
    await run(process.execPath, [standaloneServer])
    return
  }

  const nextBin = join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
  if (!existsSync(nextBin)) {
    throw new Error('[start-web] Missing standalone server and local Next binary')
  }

  console.warn('[start-web] standalone server not found; falling back to next start')
  await run(process.execPath, [nextBin, 'start', '-p', port, '-H', hostname])
}

start().catch(error => {
  console.error(error)
  process.exit(1)
})
