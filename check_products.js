const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aqpwfurradxbnqvycvkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcHdmdXJyYWR4Ym5xdnljdmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDI0NzgsImV4cCI6MTg5NzgwOTQ3OH0.WlbMVlf5Bw9gYDzKhNvXPzPBp4SFk_YqBE5rK5qLqXo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  try {
    console.log('Checking products table...\n');
    
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️  Tabella esiste ma è VUOTA');
      console.log('Dati: 0 prodotti');
      process.exit(0);
    }
    
    console.log(`✅ Tabella esiste e ha ${data.length} prodotti:\n`);
    data.forEach(p => {
      console.log(`  - ${p.name} (${p.dealer_id}): €${p.price} | Stock: ${p.stock}`);
    });
    
  } catch (err) {
    console.error('❌ Errore connessione:', err.message);
    process.exit(1);
  }
}

checkProducts();
