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
  const [error, setError] = useState('');

useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    savedHistory && setSearchHistory(JSON.parse(savedHistory))
    loadWatchlist();
},[]);

  const loadWatchlist = () => {
    airtableService.getWatchlist().then(data => {
      setWatchlist(data || []); 
    });
  };

 const saveToSearchHistory = (query) => {
    if (!query) return;
    const updateHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0,3);
    setSearchHistory(updateHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updateHistory));
  };

 const handleSearch = (query) => {
    setSearchResults([]);
    setLoading(true);
    setError('');

    if (!query.trim()) {
      setError('Please enter a search term');
      setLoading(false);
      return;
    }

    saveToSearchHistory(query);

    stockApi.searchStocks(query).then(searchResults => {
      if (!searchResults || searchResults.length === 0) {
        setError('Hey Zoe, no stocks found matching your search');
        setLoading(false);
        return;
      }
      const uniqueStocks = [];
      const symbolSet = new Set();
      searchResults.forEach(stock => {
        if (stock && stock.symbol && !symbolSet.has(stock.symbol)) {
          symbolSet.add(stock.symbol);
          uniqueStocks.push(stock);
        }
      });

      if (uniqueStocks.length === 0) {
        setError('No valid stocks found');
        setLoading(false);
        return;
      }

      const symbols = uniqueStocks.map(stock => stock.symbol);
      stockApi.getMultipleStocksEOD(symbols).then(eodDataList => {
        const priceMap = {};
        eodDataList.forEach(item => {
          item && item.symbol && (priceMap[item.symbol] = item);
        });

        const stockWithPrices = uniqueStocks.map(stock => ({
          ...stock,
          price: priceMap[stock.symbol]?.close || priceMap[stock.symbol]?.price || null,
          date: priceMap[stock.symbol]?.date || null
        })).filter(stock => stock.price !== null);

        setSearchResults(stockWithPrices);
        setLoading(false);
      });
    });
  };


const handleHistoryClick = (query) => {
    handleSearch(query)
}

  const handleAddToWatchlist = (stock) => {
    airtableService.addToWatchlist({
      symbol: stock.symbol,
      name: stock.name
    }).then(result => {
      if (result) loadWatchlist(); 
    });
  };

  const handleRemoveFromWatchlist = (stock) => {
    const watchlistItem = watchlist.find(item => item.symbol === stock.symbol);
    watchlistItem && airtableService.removeFromWatchlist(watchlistItem.id).then(result => {
      if (result) loadWatchlist();
    });
  };

const isStockInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol)
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
                        onRemoveFromWatchlist={handleRemoveFromWatchlist} 
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

export default Home;