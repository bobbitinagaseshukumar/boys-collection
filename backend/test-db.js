import pg from 'pg'
const { Client } = pg

const str = "postgresql://postgres.wtrjesipjrjvkooxradp:hX8ba1ydvOaDfs3o@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

async function test() {
  const client = new Client({
    connectionString: str,
    ssl: {
      rejectUnauthorized: false
    }
  })
  try {
    await client.connect()
    console.log("✅ SUCCESS: Database connected successfully via Singapore pooler!")
    const res = await client.query('SELECT NOW()')
    console.log('Current Time:', res.rows[0])
    await client.end()
  } catch (err) {
    console.error("❌ Connection failed:", err.message)
  }
}

test()
