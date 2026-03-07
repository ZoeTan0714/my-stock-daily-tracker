const API_KEY = '0ed3fb863442e349b99c0f1e930d56c2';
const BASE_URL = 'http://api.marketstack.com/v1';

const stockApi = {
  searchStocks: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/tickers?access_key=${API_KEY}&search=${query}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }
