import { useState } from 'react';

function SearchBar ({ onSearch, searchHistory, onHistoryClick}) {
    const [query, setQuery] = useState ('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setQuery('')
        }
    }
return (
    <div className="search-section">
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by company name or stock code'
                className='search-input'
            />
        </form>

        {searchHistory.length > 0 && (
            <div className='search-history'>
                <div className='history-items'>
                    {searchHistory.map((item, index) => (
                        <button key={index} onClick={() => onHistoryClick(item)} className='history-item'>
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
    )
}

export default SearchBar;