import { useState, useEffect } from "react";
import airtableService from '../services/airtableService'
import stockApi from '../services/stockAPI'

function Watchlist() {
    const [watchlistItems, setWatchlistItems] = useState([])
    const [stockPrices, setStockPrices] = useState ({});
    const [loading, setLoading] = useState (true)
    const [avgPrices, setAvgPrices] = useState({})

    useEffect(() => {
        loadWatchlistData();
    }, [])

    const loadWatchlistData = async() => {
        setLoading(true)

        const watchlist = await airtableService.getWatchlist();
        setWatchlistItems(watchlist)

        const initAvgPrices = {};
        watchlist.forEach(item => {
            initAvgPrices[item.symbol] = item.price || ''; 
        });
        setAvgPrices(initAvgPrices);


        if(watchlist.length > 0) {
            const symbols = watchlist.map(item => item.symbol)
            const prices = await stockApi.getMultipleStocksEOD(symbols)
            const priceMap = {}
            prices.forEach(price => {
                priceMap[price.symbol] = price
            })
            setStockPrices(priceMap)
        }

        setLoading(false)
    }

    const handleRemoveStock = (recordId) => {
    airtableService.removeFromWatchlist(recordId)
        .then(() => {
        loadWatchlistData();
        });
    }

    const handleRefreshPrices = () => {
        if (watchlistItems.length > 0) {
            setLoading(true); 
            const symbols = watchlistItems.map(item => item.symbol)
            stockApi.getMultipleStocksEOD(symbols).then(prices => {
                const priceMap = {}
                prices.forEach(price => {
                    priceMap[price.symbol] = price
                })
                setStockPrices(priceMap);
                setLoading(false);
            });
        }
    }

     const handleAvgPriceChange = (symbol, value) => {
        setAvgPrices({
            ...avgPrices,
            [symbol]: value.trim() 
        });
    }

    const saveAvgPrices = async() => {
    const updatePromises = watchlistItems.map(item => {
        const avgPrice = avgPrices[item.symbol];
        return airtableService.updateWatchlistItem(item.id, {
            "Avg Price": avgPrice 
        });
        });

        Promise.all(updatePromises).then(() => {
            loadWatchlistData();
        });
    }

    const calculateEarn = (avgPrice, currentPrice) => {
         if (!avgPrice) return '';
         if (!currentPrice || isNaN(currentPrice)) return 'N/A';

        const avg = parseFloat(avgPrice);
        const current = parseFloat(currentPrice);
        if (isNaN(avg) || avg === 0) return 'N/A'; 

        const earnPercent = ((current - avg) / avg) * 100;
        return earnPercent === -0 ? '0.00' : earnPercent.toFixed(2);
    }

    if (loading) {
        return (
            <div className="loading">
                <p>Preparing your watchlist</p>
            </div>
        )
    }

    return (
        <div className="watchlist-page">
            <h1>Zoe's Watchlist</h1>

            {watchlistItems.length === 0 ? (
                <div className="empty-watchlist">
                    <p>Your wacthlist is empty</p>
                </div>
            ) : (
                <div className="watchlist-table">
                <div className="table-header">
                    <div></div>
                    <div>Stock Details</div>
                    <div>Current Price</div>
                    <div>Avg Price</div>
                    <div>Earn</div>
                </div>

                {watchlistItems.map((item) => {
                    const currentPriceData = stockPrices[item.symbol];
                    const currentPrice = currentPriceData?.price;
                    const currentAvgPrice = avgPrices[item.symbol] || item.price || '';
                    const earnPercent = calculateEarn(currentAvgPrice, currentPrice);
                
                    return (
                    <div key={item.id} className="table-row">
                        <div>
                            <button
                                onClick={() => handleRemoveStock(item.id)}
                                style={{ 
                                    padding: '4px 8px', 
                                    background: '#e53e3e', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Remove
                            </button>
                        </div>

                        <div className="stock-details">
                            <div>
                                <strong>{item.symbol}</strong> - {item.name || item.symbol}
                            </div>
                        </div>

                        <div className="current-price">${currentPrice?.toFixed(2) || 'N/A'}
                            {currentPrice?.date && (
                                <span className="price-date">
                                    ({new Date(currentPrice.date).toLocaleDateString()})
                                </span>
                            )}
                        </div>

                         <div>
                            <input
                                type="text"
                                value={currentAvgPrice}
                                onChange={(e) => handleAvgPriceChange(item.symbol, e.target.value)}
                            />
                        </div>

                        <div className={`earn-value ${
                                    earnPercent === '' ? '' :
                                    earnPercent === 'N/A' ? 'earn-na' :
                                    (parseFloat(earnPercent) > 0) ? 'earn-profit' : 
    (parseFloat(earnPercent) < 0    ) ? 'earn-loss' : ''
                                }`}>
                                    {earnPercent === '' ? '' : 
                                     earnPercent === 'N/A' ? 'N/A' : 
                                     `${earnPercent}%`}
                        </div>
                    </div>
                )
            })} 
            
            <div>
                <button
                    onClick={handleRefreshPrices}
                    style={{ padding: '8px 16px', margin: '3px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Refresh Prices
                </button>

                <button
                    onClick={saveAvgPrices}
                    style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                Save Avg Prices
                </button>
            </div>
            
        </div>
        )}
    </div>
    );
}

export default Watchlist; 