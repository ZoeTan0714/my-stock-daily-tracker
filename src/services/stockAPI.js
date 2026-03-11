const API_KEY = '0ed3fb863442e349b99c0f1e930d56c2';
const BASE_URL = 'http://api.marketstack.com/v1';

const stockApi = {
  searchStocks: async (query) => {
      const response = await fetch(`${BASE_URL}/tickers?access_key=${API_KEY}&search=${query}&limit=10`);
      const data = await response.json();
      return data.data || [];
    },
  
  getStockEOD: async (symbol) => {
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&sort=DESC&limit=1`
      );
      
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const stockData = data.data[0];
        return {
          symbol: stockData.symbol,
          name: companyNames[stockData.symbol] || stockData.symbol,
          price: stockData.close,
          date: stockData.date
        };
      } 
      return null 
    },
  
  getMultipleStocksEOD: async (symbols) => {
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbols.join(',')}&sort=DESC&limit=${symbols.length}`
      );
      
      const data = await response.json();
      
      return data.data.map(stock => ({
        symbol: stock.symbol,
        name: companyNames[stock.symbol] || stock.symbol,
        price: stock.close,
        date: stock.date
      }));
    }
  }

export default stockApi; 

