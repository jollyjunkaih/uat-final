import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  // prettyPrintDebugQueries: env.get('ENABLE_DB_LOG') === true ? true : false,
  connections: {
    postgres: {
      client: 'pg',
      pool: {
        min: 2,
        max: 20,
        idleTimeoutMillis: 6000,
      },
      // debug: env.get('ENABLE_DB_LOG') === true ? true : false,
      connection: {
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        host: env.get('DB_HOST'),
        ssl: env.get('DB_SSL') === 'true',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
