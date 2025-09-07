import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

const FEEDS = [
  {
    url: 'https://www.theverge.com/rss/index.xml',
    name: 'The Verge'
  },
  {
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    name: 'Ars Technica'
  },
  {
    url: 'https://www.wired.com/feed/rss',
    name: 'Wired'
  },
  {
    url: 'https://techcrunch.com/feed/',
    name: 'TechCrunch'
  },
  {
    url: 'https://dev.to/feed',
    name: 'DEV Community'
  }
]

export async function GET() {
  try {
    const items: any[] = []

    await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const parsed = await parser.parseURL(feed.url)
          const feedItems = parsed.items.slice(0, 10).map((item: any) => ({
            source: feed.name,
            title: item.title || 'Untitled',
            url: item.link || '#',
            publishedAt: item.isoDate || item.pubDate,
            summary: item.contentSnippet || item.content?.substring(0, 200) + '...',
          }))
          items.push(...feedItems)
        } catch (error) {
          console.error(`Failed to fetch ${feed.name}:`, error)
        }
      })
    )

    // Sort by publication date (newest first)
    items.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return dateB - dateA
    })

    // Remove duplicates based on URL
    const uniqueItems = items.filter((item, index, self) =>
      index === self.findIndex(t => t.url === item.url)
    )

    return NextResponse.json({
      items: uniqueItems.slice(0, 20),
      count: uniqueItems.length
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}


