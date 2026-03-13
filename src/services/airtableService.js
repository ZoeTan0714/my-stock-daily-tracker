const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_TOKEN;  
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;    
const AIRTABLE_TABLE_NAME = 'Zoewatchlist';


const airtableService = {
    getWatchlist: async () => {
       const response = await fetch (
        `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist?maxRecords=3&view=Grid%20view`,
        {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        }
        })

      if (!response.ok) return [];
      const data = await response.json();
      return data.records.map(record => ({
        id: record.id,
        symbol: record.fields.Stock,
        price: record.fields["Avg Price"]
    }));
  },
      
      

    addToWatchlist: async (stock) => {
    if (!stock.symbol || !stock.name) return false;

    const response = await fetch(
      `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "Stock": stock.symbol.trim(),
        }
        })
      }
    )
    return response.ok;
  },

  removeFromWatchlist: async (recordId) => {
    const response = await fetch(
      `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!response.ok) return false;
      return await response.json();
    },

  updateWatchlistItem: async (recordId, fields) => {
    const response = await fetch(
      `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist/${recordId}`,
      {
        method: 'PATCH', 
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields }) 
      }
    );
    return response.ok; 
  }
};

export default airtableService;