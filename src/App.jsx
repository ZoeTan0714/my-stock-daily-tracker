// src/App.jsx
import React from "react";






const App = () => {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/watchlist" element={<Watchlist />} />
          </Routes>
        </div>
      </div>
    </Router>




  );
}

export default App

