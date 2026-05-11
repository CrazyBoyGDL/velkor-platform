module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres')
  const databaseUrl = env('DATABASE_URL')

  if (databaseUrl) {
    return {
      connection: {
        client,
        connection: databaseUrl,
        pool: { min: 2, max: 10 },
      },
    }
  }

  return {
    connection: {
      client,
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'railway'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', ''),
        ssl: false,
      },
      pool: { min: 2, max: 10 },
    },
  }
}
