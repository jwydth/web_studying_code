# Interactive Coding Study Site - Setup Guide

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/coding_study_site"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

3. **Set up the database:**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Implemented

✅ **Core Architecture**

- Next.js 15 with App Router
- TypeScript configuration
- Tailwind CSS with custom dark theme
- Prisma ORM with PostgreSQL schema

✅ **Components**

- NewsFeed: Real-time tech news aggregation
- SkillMap: Interactive learning path visualization
- Playground: Monaco Editor with JavaScript execution
- QuizCard: Spaced repetition system (SM-2 algorithm)

✅ **API Routes**

- `/api/news`: RSS feed aggregation from multiple sources

✅ **Core Libraries**

- Path graph algorithms for learning dependencies
- SM-2 spaced repetition system
- Utility functions for styling

## Database Schema

The application uses a comprehensive Prisma schema with:

- User management and progress tracking
- Learning paths with skill dependencies (DAG)
- Lessons with markdown content
- Flashcards with spaced repetition
- News articles with bookmarking
- Review scheduling system

## Next Steps

1. **Set up authentication** (Supabase or Auth.js)
2. **Seed the database** with sample learning paths
3. **Add more news sources** and implement deduplication
4. **Implement user progress tracking**
5. **Add community features** (comments, discussions)

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Editor:** Monaco Editor
- **Visualization:** React Flow
- **Icons:** Lucide React
- **Styling:** Tailwind CSS with custom components

## Development

- **Linting:** ESLint with Next.js config
- **Type Checking:** TypeScript strict mode
- **Styling:** Tailwind CSS with custom utilities
- **Database:** Prisma with migrations

## Deployment

The application is ready for deployment on:

- Vercel (recommended)
- Railway
- Render
- Any platform supporting Next.js and PostgreSQL

Make sure to set up your environment variables in your deployment platform.

