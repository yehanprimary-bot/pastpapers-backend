# PastPapers Backend (Node.js)

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start server:
   ```
   npm start
   ```
3. API endpoints:
   - `GET /api/search?year=2024&subject=physics` — returns JSON list of papers
   - `GET /api/download?url=<pdfUrl>` — proxies a PDF download

**Note:** This is a starter scraper/proxy. You must review `scraper/pastpaperScraper.js` to adapt selectors to the actual site structure and confirm scraping is allowed by the target site's terms/robots.txt.
