'use client'

import { useEffect } from 'react'
import { trackArticleView, trackDeviceBehavior, useScrollDepth } from './Analytics'

type Props = {
  slug: string
  category: string
  readTime: string
  technicalLevel?: string
}

export default function ArticleEngagementTracker({ slug, category, readTime, technicalLevel }: Props) {
  useScrollDepth(`blog-${slug}`)

  useEffect(() => {
    trackArticleView(slug, category, readTime, technicalLevel)
    trackDeviceBehavior(`blog-${slug}`, 'article-view')
  }, [category, readTime, slug, technicalLevel])

  return null
}
