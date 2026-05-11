const cfg = require('./config/database.js')

console.log('=== DB CONFIG CHECK ===')
console.log('DATABASE_HOST:', process.env.DATABASE_HOST)
console.log('DATABASE_PORT:', process.env.DATABASE_PORT)
console.log('DATABASE_NAME:', process.env.DATABASE_NAME)
console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME)
console.log('DATABASE_PASSWORD set:', !!process.env.DATABASE_PASSWORD)

try {
  // cfg is now a static object (not a function)
  const isObj = cfg && typeof cfg === 'object'
  const conn = isObj && cfg.connection && cfg.connection.connection
  if (!isObj || !cfg.connection || !cfg.connection.client) {
    console.error('Config ERROR: missing connection.client')
    process.exit(1)
  }
  console.log('Config OK:', JSON.stringify({
    client: cfg.connection.client,
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
