import React from "react";
import { Link, useLocation } from 'react-router-dom';

function Navbar(){
    const location = useLocation();
    
    return (
    <nav className="navbar">
      <div className="navbar-item">
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          Stock tracker
        </Link>
      </div>

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