import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL in environment variables.')
  }

  const parsedUrl = new URL(databaseUrl)

  const client = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    prepare: false,
  })
  const db = drizzle(client)

  const result = await db.execute(sql`
    select
      1 as ok,
      current_database() as database_name,
      current_user as database_user,
      inet_server_addr()::text as server_addr
  `)
  console.log('DB connection check passed:', {
    host: parsedUrl.hostname,
    port: parsedUrl.port || '5432',
    rows: result,
  })

  await client.end({ timeout: 5 })
}

main().catch((error) => {
  const databaseUrl = process.env.DATABASE_URL
  const host = databaseUrl ? new URL(databaseUrl).hostname : 'unknown'
  const cause = error instanceof Error && 'cause' in error ? error.cause : undefined
  const networkCode =
    cause && typeof cause === 'object' && 'code' in cause ? String(cause.code) : null

  console.error('DB connection check failed.', {
    host,
    networkCode,
    error,
  })
  process.exit(1)
})
