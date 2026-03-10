import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import StockCard from '../components/StockCard';
import stockApi from '../services/stockApi';
import airtableService from '../services/airtableService';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory))
    }
    loadWatchlist();
},[]);

const loadWatchlist = async () => {
    const watchlistData = await airtableService.getWatchlist()
    setWatchlist(watchlistData)
};

const saveToSearchHistory = (query) => {
    const updateHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0,3)
    setSearchHistory(updateHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updateHistory))
};

const handleSearch = async (query) => {
    setLoading(true)
    setError('');
    setSearchResults([])

    {
        saveToSearchHistory(query)

        const searchResults = await stockApi.searchStocks (query);

        if (searchResults.length === 0) {
            setError('No stocks found, please tey another search')
            setLoading(false)
            return;
        }

        const stockWithPrices = []
        for (const stock of searchResults) {
            const eodData = await stockApi.getStockEOD(stock.symbol);
            if(eodData) {
                stockWithPrices.push({
                    ...stock,
                    price: eodData.price,
                    date: eodData.date
                })
            }
        }
    }
    } 
}


