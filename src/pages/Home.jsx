import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import StockCard from '../components/StockCard';
import stockApi from '../services/stockAPI';
import airtableService from '../services/airtableService';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('');

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
    setSearchResults([])

    {saveToSearchHistory(query)

        const searchResults = await stockApi.searchStocks (query);

        if (searchResults.length === 0) {
            setLoading(false)
            return;
        }

        const stockWithPrices = []
        
        for (const stock of searchResultsData) {
            const eodData = await stockApi.getStockEOD(stock.symbol);
            if(eodData) {
                stockWithPrices.push({
                    ...stock,
                    price: eodData.price,
                    date: eodData.date
                })
            }
        }

    setSearchResults(stockWithPrices);
    setLoading(false)
}

const handleHistoryClick = (query) => {
    handleSearch(query)
}

const handleAddToWatchlist = async(stock) => {
    await airtableService.addToWatchlist(stock.symbol, stock.name)
    await loadWatchlist
}

const handleRemoveFromWatchlist = async (stock) => {
    const watchlistItem = watchlist.find(item => item.symbol === stock.symbol)
    if (watchlistItem) {
        await airtableService.removeFromWatchlist(watchlistItem.id)
        await loadWatchlist()
    }
}

const isStockInWatchlist = (symbol) => {
    return watchlist.some(item.symbol === symbol)
}


return (
    <div className="home-page">
        <h1>Hey Zoe, please search the stock you're interested</h1>

        <SearchBar 
        onSearch={handleSearch}
        searchHistory={searchHistory}
        onHistoryClick={handleHistoryClick}
        />

        {loading && (
            <div className='loading'>
                <p>Searching!</p>
            </div>
        )}

        <div>
            <h2>Here's the results</h2>
            {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                   <StockCard
                        key={stock.symbol}
                        stock={stock}
                        isInWatchlist={isStockInWatchlist(stock.symbol)}
                        onAddToWatchlist={handleAddToWatchlist}
                        onRemoveWatchlist={handleRemoveFromWatchlist} 
                   /> 
                ))
            ) : (
                !loading && (
                    <p className='no-results'>No result found, try search by stock name again</p>
                )
            )
            }
        </div>
    </div>
)
}
}

export default Home;