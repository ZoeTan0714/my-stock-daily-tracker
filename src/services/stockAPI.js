const API_KEY = import.meta.env.VITE_MARKETSTACK_API_KEY;
const BASE_URL = 'http://api.marketstack.com/v1';

const CACHE_DURATION = 60 * 60 * 1000; 
const stockCache = JSON.parse(localStorage.getItem('stockCache') || '{}');

const MAX_DAILY_REQUESTS = 50; 
const REQUEST_INTERVAL = 3000; 
let lastRequestTime = 0;

const today = new Date().toLocaleDateString();
const requestRecord = JSON.parse(localStorage.getItem('requestRecord') || '{"date":"","count":0}');
if (requestRecord.date !== today) {
  requestRecord.date = today;
  requestRecord.count = 0;
  localStorage.setItem('requestRecord', JSON.stringify(requestRecord));
}

const cleanExpiredCache = () => {
  const now = Date.now();
  const newCache = {};
  Object.keys(stockCache).forEach(key => {
    if (stockCache[key].timestamp && now - stockCache[key].timestamp < CACHE_DURATION) {
      newCache[key] = stockCache[key];
    }
  });
  localStorage.setItem('stockCache', JSON.stringify(newCache));
  Object.assign(stockCache, newCache);
};

const canMakeRealRequest = () => {

  if (requestRecord.count >= MAX_DAILY_REQUESTS) return false;
  const now = Date.now();
  if (now - lastRequestTime < REQUEST_INTERVAL) return false;
  return true;
};

const recordRequest = () => {
  requestRecord.count += 1;
  localStorage.setItem('requestRecord', JSON.stringify(requestRecord));
  lastRequestTime = Date.now();
};

const setCache = (key, data) => {
  stockCache[key] = {
    data: data,
    timestamp: Date.now()
  };
  localStorage.setItem('stockCache', JSON.stringify(stockCache));
};

const baseFetch = (url) => {
  cleanExpiredCache();
  const cacheKey = btoa(url); 
  if (stockCache[cacheKey]) {
    return Promise.resolve(stockCache[cacheKey].data);
  }

  if (!canMakeRealRequest()) {
    return Promise.resolve({ data: [] }); 
  }


  recordRequest();
  return fetch(url)
    .then(response => {
      if (!response.ok) return { data: [] };
      return response.json();
    })
    .then(data => {
      setCache(cacheKey, data);
      return data;
    })
    .catch(() => ({ data: [] })); 
};



const companyNames = {};

const stockApi = {
  searchStocks: async (query) => {
      const response = await fetch(`${BASE_URL}/tickers?access_key=${API_KEY}&search=${query}&limit=10`);
      const data = await response.json();
      const validStocks = (data.data || []).filter(stock => 
      stock && stock.symbol && !stock.symbol.match(/X$|MX$|IX$/i)
      );
      return validStocks;
    },
  
  getStockEOD: async (symbol) => {
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${encodeURIComponent(symbol)}&limit=1`
      );
      
      if (response.status === 406) return null;
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const stockData = data.data[0];
        return {
          symbol: stockData.symbol,
          name: stockData.name || companyNames[stockData.symbol] || stockData.symbol,
          price: stockData.close,
          date: stockData.date
        };
      } 
      return null 
    },
  
  getMultipleStocksEOD: async (symbols) => {
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbols.map(s => encodeURIComponent(s)).join(',')}&limit=1`
      );
      if (response.status === 406) return [];
      
      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

      return data.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name || companyNames[stock.symbol] || stock.symbol,
        price: stock.close,
        date: stock.date
      }));
    }
  }

export default stockApi; 

