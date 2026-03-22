import { useEffect, useRef, useState } from 'react'
import { fetchMovies, type MovieFilters, type MovieShort } from '../api/kinopoisk'

interface Options {
  limit?: number
  filters?: MovieFilters
}

function formatApiError(error: unknown): string {
  const err = error as {
    response?: { status?: number; data?: { message?: string } }
    message?: string
  }
  const status = err?.response?.status
  const message = String(err?.response?.data?.message ?? err?.message ?? '')

  if (status === 401 || status === 403 || message.includes('401') || message.includes('403')) {
    return 'Ошибка доступа к API'
  }
  if (message.includes('timeout') || message.includes('Timeout')) {
    return 'Превышено время ожидания'
  }
  return 'Не удалось загрузить фильмы'
}

export function useInfiniteMovies({ limit = 50, filters }: Options = {}) {
  const [movies, setMovies] = useState<MovieShort[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  hasMoreRef.current = hasMore
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isCancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const loadPage = async () => {
      if (!hasMoreRef.current) return
      if (isLoadingRef.current) {
        retryTimer = setTimeout(loadPage, 100)
        return
      }

      isLoadingRef.current = true
      if (page === 1) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      try {
        const response = await fetchMovies({ page, limit, filters })
        if (isCancelled) return

        const hasMorePages = response.docs.length === limit
        setMovies((prev) => [...prev, ...response.docs])
        setHasMore(hasMorePages)
        hasMoreRef.current = hasMorePages
      } catch (err) {
        if (!isCancelled) setError(formatApiError(err))
      } finally {
        isLoadingRef.current = false
        if (!isCancelled) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    }

    loadPage()
    return () => {
      isCancelled = true
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [page, limit, filters])

  useEffect(() => {
    const sentinelElement = sentinelRef.current
    if (!sentinelElement) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
        setPage((prev) => prev + 1)
      }
    })
    observerRef.current.observe(sentinelElement)

    return () => observerRef.current?.disconnect()
  }, [hasMore, movies.length])

  return { movies, loading, loadingMore, error, hasMore, sentinelRef }
}
