# Zamp Nexus Analyzer

Zamp Nexus Analyzer is a sales tax economic nexus exposure scanner that checks transaction records against US state thresholds to show where you owe sales tax and calculate registration deadlines.

## Quick Start

### 1. Set up config
Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` (if omitted, the app runs in sandbox mode with mock briefings).
```bash
cp .env.example .env
```

### 2. Spin up the server
```bash
cd server
npm install
npm run dev
```
The Express server boots on `http://localhost:3001`.

### 3. Spin up the frontend
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React dev client boots on `http://localhost:5173`.

### 4. Or run the unified Docker container
```bash
docker build -t zamp-nexus-analyzer .
docker run -p 3001:3001 --env-file .env zamp-nexus-analyzer
```
Go to `http://localhost:3001` in your browser.

## CSV Format

The app detects columns dynamically. Just upload or paste a CSV with headers containing keywords like:
- **State**: `state`, `st`, or `region`
- **Revenue**: `revenue`, `sales`, `amount`, or `gmv`
- **Transactions**: `transactions`, `orders`, or `txn`

Example:
```csv
state,revenue,transactions
California,142000,310
Texas,98000,195
```
