import React from "react";
import { Link, useLocation } from 'react-router-dom';

function Navbar(){
    const location = useLocation();
    
    return (
    <nav className="navbar">
      <div className="nav-brand">Stock Tracker</div>
      <div className="nav-links">
        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/home/watchlist" className={location.pathname === '/home/watchlist' ? 'active' : ''}>
          Watchlist
        </Link>
      </div>
    </nav>
    )
}

export default Navbar;