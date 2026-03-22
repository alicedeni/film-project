import axios from 'axios'
import { normalizeGenres, normalizeRating } from '../utils/movie'

const apiUrl = (import.meta.env.VITE_KINOPOISK_API_URL ?? '').replace(/\/$/, '')
const apiKey = import.meta.env.VITE_KINOPOISK_API_KEY ?? ''
const baseUrl = import.meta.env.DEV ? '/proxy-kp' : apiUrl

const http = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
  headers: { 'X-API-KEY': apiKey },
})

export function isApiConfigured(): boolean {
  if (!apiKey.trim()) return false
  return import.meta.env.DEV || Boolean(apiUrl)
}

export interface MovieShort {
  id: string
  name: string
  year?: number
  rating?: number
  posterUrl?: string
  genres?: string[]
  movieLength?: number
}

export interface MoviesResponse {
  docs: MovieShort[]
  total: number
  page: number
  limit: number
}

export interface MovieDetails extends MovieShort {
  description?: string
  movieLength?: number
  alternativeName?: string
}

export interface MovieFilters {
  genres?: string[]
  ratingFrom?: number
  ratingTo?: number
  yearFrom?: number
  yearTo?: number
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getPosterUrl(item: Record<string, unknown>): string | undefined {
  const direct = asString(item.posterUrl) ?? asString(item.poster)
  if (direct) return direct

  const poster = item.poster
  if (poster && typeof poster === 'object') {
    const obj = poster as { url?: string; previewUrl?: string }
    return asString(obj.url) ?? asString(obj.previewUrl)
  }
  return undefined
}

function takeNumber(value: unknown): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

function parseMovie(item: unknown): MovieShort {
  if (!item || typeof item !== 'object') {
    return { id: '0', name: 'Без названия' }
  }

  const raw = item as Record<string, unknown>
  const id = raw.id != null ? String(raw.id) : '0'
  const name =
    asString(raw.name) ||
    asString(raw.enName) ||
    asString(raw.alternativeName) ||
    asString((raw.names as { ru?: string })?.ru) ||
    'Без названия'
  const year = takeNumber(raw.year) ?? takeNumber(raw.releaseYear)
  const movieLength = takeNumber(raw.movieLength) ?? takeNumber(raw.filmLength)

  return {
    id,
    name,
    year,
    rating: normalizeRating(raw.rating),
    posterUrl: getPosterUrl(raw),
    genres: normalizeGenres(raw.genres),
    movieLength,
  }
}

function parseMovieDetails(item: unknown): MovieDetails {
  const base = parseMovie(item)
  if (!item || typeof item !== 'object') return base

  const raw = item as Record<string, unknown>
  return {
    ...base,
    description: asString(raw.description) || asString(raw.shortDescription) || undefined,
    movieLength: takeNumber(raw.movieLength) ?? takeNumber(raw.filmLength),
    alternativeName: asString(raw.alternativeName) ?? asString(raw.enName),
  }
}

function findMoviesInResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  const body = data as Record<string, unknown>
  const docs = body.docs
  if (Array.isArray(docs)) return docs
  const dataArr = (body as { data?: unknown[] }).data
  if (Array.isArray(dataArr)) return dataArr
  const items = (body as { items?: unknown[] }).items
  if (Array.isArray(items)) return items
  const results = (body as { results?: unknown[] }).results
  if (Array.isArray(results)) return results
  return []
}

export async function fetchMovies(params: {
  page?: number
  limit?: number
  filters?: MovieFilters
}): Promise<MoviesResponse> {
  const { page = 1, limit = 50, filters } = params
  const query: Record<string, unknown> = { page, limit }
  const yearFrom = filters?.yearFrom ?? 1980
  const yearTo = filters?.yearTo ?? new Date().getFullYear()
  query.year = `${yearFrom}-${yearTo}`

  if (filters?.genres?.length) {
    query['genres.name'] = filters.genres.join(',')
  }

  const ratingFrom = filters?.ratingFrom ?? 0
  const ratingTo = filters?.ratingTo ?? 10
  if (ratingFrom > 0 || ratingTo < 10) {
    query['rating.kp'] = `${ratingFrom}-${ratingTo}`
  }

  const { data } = await http.get<unknown>('/movie', { params: query })
  const body = data as Record<string, unknown>
  const rawItems = findMoviesInResponse(data)
  const movies = rawItems.map(parseMovie)

  const total =
    typeof body.total === 'number'
      ? body.total
      : typeof body.totalDocs === 'number'
        ? body.totalDocs
        : movies.length

  return {
    docs: movies,
    total,
    page: typeof body.page === 'number' ? body.page : page,
    limit: typeof body.limit === 'number' ? body.limit : limit,
  }
}

export async function fetchMovieById(id: string): Promise<MovieDetails> {
  const { data } = await http.get<unknown>(`/movie/${id}`)
  return parseMovieDetails(data)
}
