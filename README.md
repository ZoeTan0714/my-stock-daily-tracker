When use my current trading app, I have to click into each stock to check my earning status. This is why I want to develop my own tool to track my earning, by getting the current stock price, as well as the avgerage price of the total amounts that I brought in. 

⭐**Live Deployment**
You can access the live version here: https://zoestockwatchlist.netlify.app/home

⭐**How it works:**
When launch the website, it will be home page by default. There will be a nav bar on the top which includes "Home" and "Watchlist".

Home page (./home) 
• As a user, I can search the stock by company name / stock code
• I can also see the 3 search history, and click them to conduct direct search 
• When click "search" button / historically searched stock, the stock will be displayed, with a "+" button (to be added to the watch list), or "-" button (to be removed from the watch list)

Watchlist (./home/watchlist)
• In watchlist, all stocks will be displayed row by row. There will be 3 columns, where "Stock details" on the left takes most of the space, "Your avg price" in the second column, and "Status" in the last column, which calculates the "(Avg price - current stock price) / Avg price * 100%". At the bottom, there should be a "Save" button, which saves the "Your avg price" to Airtable 
• In stock details, it includes the stock name & price at the end of the day

⭐**Tech Stack**
Frontend: React
External APIs: https://marketstack.com
Database: Airtable to store the stocks in watchlist 

