import React from 'react';

function StockCard ({ stock, isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist})
{
    const formattedPrice = stock.price ? `$${stock.price.toFixed(2)}` : 'Price unavilable';
    const formattedDate = stock.date ? new Date(stock.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month:'short',
        day:'numeric'
    }) : '';

return (
    <div className="stock-card">
      <div className="stock-info">
        <div className="stock-header">
          <h3 className="stock-symbol">{stock.symbol}</h3>
          <span className="stock-name">{stock.name || stock.symbol}</span>
        </div>
        <div className="stock-price-details">
          <p className="stock-price">
            <strong>Price:</strong> {formattedPrice}
          </p>
          {formattedDate && (
            <p className="stock-date">
              <strong>Date:</strong> {formattedDate}
            </p>
          )}
        </div>
      </div>
      
      <div className="stock-actions">
        {isInWatchlist ? (
          <button 
            onClick={() => onRemoveFromWatchlist(stock)}
            className="remove-btn"
            title="Remove from watchlist"
          >
            −
          </button>
        ) : (
          <button 
            onClick={() => onAddToWatchlist(stock)}
            className="add-btn"
            title="Add to watchlist"
          >
            +
          </button>
        )}
      </div>
    </div>
    );
}

export default StockCard;