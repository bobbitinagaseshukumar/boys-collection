import pg from 'pg'
const { Client } = pg

const regions = [
  'ap-south-1',     // Mumbai
  'us-east-1',      // N. Virginia
  'us-west-1',      // N. California
  'us-east-2',      // Ohio
  'us-west-2',      // Oregon
  'eu-west-1',      // Ireland
  'eu-west-2',      // London
  'eu-central-1',   // Frankfurt
  'ap-southeast-1', // Singapore
  'ap-northeast-1', // Tokyo
  'sa-east-1'       // Sao Paulo
]

async function test() {
  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`
    const str = `postgresql://postgres.wtrjesipjrjvkooxradp:hX8ba1ydvOaDfs3o@${host}:6543/postgres`
    const client = new Client({
      connectionString: str,
      ssl: { rejectUnauthorized: false }
    })
    try {
      await client.connect()
      console.log(`✅ SUCCESS: Found database region! ${reg}`)
      const res = await client.query('SELECT NOW()')
      console.log('Time:', res.rows[0])
      await client.end()
      return
    } catch (err) {
      console.log(`❌ Failed ${reg}: ${err.message}`)
    }
  }
  console.log("Finished testing all regions.")
}

test()
