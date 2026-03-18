import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL in environment variables.')
  }

  const client = postgres(databaseUrl)
  const db = drizzle(client)

  const result = await db.execute(sql`select 1 as ok`)
  console.log('DB connection check:', result)

  await client.end({ timeout: 5 })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
