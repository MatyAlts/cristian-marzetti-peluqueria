<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19LiSicUE06G4CR1nmFWOrAKDp3A_nk3_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set API environment variables in `.env.local` (see `.env.example`). These are used by the serverless functions, not exposed to the client.
3. Initialize Postgres (creates tables and pgvector):
   `npm run db:init`
4. Ingest knowledge base into Postgres:
   `npm run ingest`
5. Run the app UI:
   `npm run dev`

Optional: to run the API locally, use Vercel CLI from `frontend/`:
`vercel dev`
