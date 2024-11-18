const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

async function inspectTables() {
  try {
    // Get trade_data structure
    const { data: tradeData, error: tradeError } = await supabase
      .from('trade_data')
      .select('*')
      .limit(1)
    
    if (tradeError) throw tradeError
    console.log('\nTrade Data Structure:', tradeData ? Object.keys(tradeData[0]) : 'No data')
    console.log('\nTrade Data Sample:', tradeData ? tradeData[0] : 'No data')
    
    // Get market_data structure
    const { data: marketData, error: marketError } = await supabase
      .from('market_data')
      .select('*')
      .limit(1)
    
    if (marketError) throw marketError
    console.log('\nMarket Data Structure:', marketData ? Object.keys(marketData[0]) : 'No data')
    console.log('\nMarket Data Sample:', marketData ? marketData[0] : 'No data')
    
    // Get trade_history structure
    const { data: historyData, error: historyError } = await supabase
      .from('trade_history')
      .select('*')
      .limit(1)
    
    if (historyError) throw historyError
    console.log('\nTrade History Structure:', historyData ? Object.keys(historyData[0]) : 'No data')
    console.log('\nTrade History Sample:', historyData ? historyData[0] : 'No data')
    
  } catch (error) {
    console.error('Error inspecting tables:', error)
  }
}

inspectTables()
