import { useState, useEffect } from "react";
import airtableService from '../services/airtableService'
import stockApi from '../services/stockAPI'

function Watchlist() {
    const [watchlistItems, setWatchlistItems] = useState([])
    const [stockPrices, setStockPrices] = useState ({});
    const [loading, setLoading] = useState (true)
    // const [saving, setSaving] = useState(false)
    // const [avgPrices, setAvgPrices] = useState({})

    useEffect(() => {
        loadWatchlistData();
    }, [])

    const loadWatchlistData = async() => {
        setLoading(true)

        const watchlist = await airtableService.getWatchlist();
        setWatchlistItems(watchlist)

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
                    <div>Stock Details</div>
                    <div>Current Price</div>
                </div>

                {watchlistItems.map((item) => {
                    const currentPrice = stockPrices[item.symbol]

                return (
                    <div key={item.id} className="table-row">
                        <div className="stock-details">
                            <div>
                                <strong>{item.symbol}</strong> - {item.name || item.symbol}
                            </div>
                        </div>

                        <div className="current-price">${currentPrice?.price?.toFixed(2) || 'N/A'}
                            {currentPrice?.date && (
                                <span className="price-date">
                                    ({new Date(currentPrice.date).toLocaleDateString()})
                                </span>
                            )}
                        </div>
                    </div>
                )
            })} </div>
            )}
        </div>
        );
    }

export default Watchlist; 