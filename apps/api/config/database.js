module.exports = {
  connection: {
    client: 'postgres',
    connection: {
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'railway',
      user: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      ssl: false,
    },
    pool: { min: 2, max: 10 },
  },
}
