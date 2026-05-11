const fn = require('./config/database.js')
const env = (k, d) => process.env[k] !== undefined ? process.env[k] : d
env.int = (k, d) => parseInt(process.env[k] || d)
env.bool = (k, d) => process.env[k] !== undefined ? process.env[k] === 'true' : d
env.array = (k, d) => process.env[k] ? process.env[k].split(',') : d

console.log('=== DB CONFIG CHECK ===')
console.log('DATABASE_HOST:', process.env.DATABASE_HOST)
console.log('DATABASE_PORT:', process.env.DATABASE_PORT)
console.log('DATABASE_NAME:', process.env.DATABASE_NAME)
console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME)
console.log('DATABASE_PASSWORD set:', !!process.env.DATABASE_PASSWORD)

try {
  const cfg = fn({ env })
  const conn = cfg.connection && cfg.connection.connection
  console.log('Config OK:', JSON.stringify({
    client: cfg.connection && cfg.connection.client,
    host: conn && conn.host,
    port: conn && conn.port,
    database: conn && conn.database,
    user: conn && conn.user,
    hasPassword: !!(conn && conn.password),
  }))
} catch (e) {
  console.error('Config ERROR:', e.message)
  process.exit(1)
}
console.log('=== CONFIG OK ===')
