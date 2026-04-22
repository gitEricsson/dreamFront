# Election UI (React + TypeScript + Redux Toolkit)

Minimalist, visually clean UI for the Election backend API.

## Features
- **Voter**: register a user or load by ID
- **Elections**: list/create/start/end elections
- **Voting**: cast a vote (your API does not expose candidate listing, so you provide `candidateId`)
- **Results**: winner + detailed vote counts per candidate

## API base URL
By default the UI calls `http://localhost:8080`.

To change it, create `Election/.env` (or copy from `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Run

```bash
cd Election
npm install
npm run dev
```

## Build

```bash
cd Election
npm run build
```

## Screens
- **Dashboard**: overview + current voter
- **Elections**: manage elections
- **Election detail**: start/end + cast vote + link to results
- **Results**: winner + vote counts

