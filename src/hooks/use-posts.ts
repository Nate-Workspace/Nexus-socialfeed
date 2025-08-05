"use client"

import { useState, useCallback } from "react"
import { type Post, fetchPostsMockApi } from "@/lib/mock-api"

const POSTS_PER_LOAD = 7

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)


  const fetchPosts = useCallback(
    async (currentOffset: number) => {
      if (loading || !hasMore) return

      setLoading(true)
      try {
        const { posts: newPosts, hasMore: newHasMore } = await fetchPostsMockApi(currentOffset, POSTS_PER_LOAD)
        setPosts((prevPosts) => [...prevPosts, ...newPosts])
        setOffset(currentOffset + newPosts.length)
        setHasMore(newHasMore)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setHasMore(false) 
      } finally {
        setLoading(false)
      }
    },
    [loading, hasMore], 
  )


  const initialLoad = useCallback(() => {
    if (posts.length === 0 && !loading) {
      fetchPosts(0) 
    }
  }, [posts.length, loading, fetchPosts]) 

  const loadMorePosts = useCallback(() => {
    fetchPosts(offset) 
  }, [offset, fetchPosts])

  return { posts, loading, hasMore, initialLoad, loadMorePosts }
}
