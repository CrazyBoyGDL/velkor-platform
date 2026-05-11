const fn = require('./config/database.js')
const env = (k, d) => process.env[k] !== undefined ? process.env[k] : d
env.int = (k, d) => parseInt(process.env[k] || d)
env.bool = (k, d) => process.env[k] === 'true'
env.array = (k, d) => process.env[k] ? process.env[k].split(',') : d

console.log('=== DB CONFIG CHECK ===')
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT)
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL)
console.log('DATABASE_HOST:', process.env.DATABASE_HOST)

try {
  const cfg = fn({ env })
  console.log('Config result:', JSON.stringify({
    hasConnection: !!cfg.connection,
    client: cfg.connection && cfg.connection.client,
    connType: cfg.connection && typeof cfg.connection.connection,
  }))
} catch (e) {
  console.error('Config ERROR:', e.message)
  process.exit(1)
}
console.log('=== CONFIG OK ===')
