'use client'
/**
 * Invisible component — mounts the useScrollDepth hook on any page.
 * Use in server components (blog posts, service pages) that can't import hooks directly.
 *
 * <ScrollDepthTracker page="blog-post" />
 */
import { useScrollDepth } from './Analytics'

export default function ScrollDepthTracker({ page }: { page: string }) {
  useScrollDepth(page)
  return null
}
