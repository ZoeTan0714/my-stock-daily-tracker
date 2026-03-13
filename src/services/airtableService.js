const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_TOKEN;  
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;    
const AIRTABLE_TABLE_NAME = 'Zoewatchlist';


const airtableService = {
    getWatchlist: async () => {
       const response = await fetch (
        `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist?maxRecords=3&view=Grid%20view`,
        {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
        }
       )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.records) {
          return [];
        }

        const watchlist = data.records.map(record => ({
          id: record.id,
          symbol: record.fields.symbol,
          name: record.fields.name,
        // avgPrice: record.fields.avgPrice || 0
        }));
        return watchlist
    },

    addToWatchlist: async (stock) => {
    const response = await fetch(
      `https://api.airtable.com/v0/apppqte72hYNhkcPS/Zoewatchlist`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            fields: {
              symbol: stock.symbol,
              name: stock.name,
            //   avgPrice: 0
            }
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.records[0];
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.deleted === true;
  },

    // updateAvgPrice: async (recordId, avgPrice) => {
    // const response = await fetch(
    //   `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
    //   {
    //     method: 'PATCH',
    //     headers: {
    //       'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       records: [{
    //         id: recordId,
    //         fields: {
    //           avgPrice: parseFloat(avgPrice) || 0
    //         }
    //       }]
    //     })
    //   }
    // );
    
//     const data = await response.json();
//     return data.records[0];
// }
}

export default airtableService;