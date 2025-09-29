/**
 * SWR Fetcher Function for DEX Real-Time Streaming Platform
 *
 * This module provides a standardized data fetching function optimized for the streaming
 * platform's API consumption patterns. It serves as the bridge between SWR (Stale-While-Revalidate)
 * data fetching library and the platform's Next.js API routes, enabling efficient caching
 * and real-time data synchronization.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Designed specifically for use with SWR's data fetching patterns
 * - Axios Foundation: Leverages axios for robust HTTP client capabilities and error handling
 * - Data Extraction: Automatically extracts response data for clean API consumption
 * - Type Safety: Provides TypeScript support for all data fetching operations
 *
 * The streaming platform relies on this fetcher for:
 * - Movie Data Fetching: Retrieving movie catalogs, individual movies, and random content
 * - User Data Management: Fetching current user information and authentication state
 * - Favorites System: Loading user's favorite movies and personalized content
 * - Real-time Updates: Enabling SWR's caching and revalidation for optimal performance
 *
 * @see {@link https://swr.vercel.app/} SWR Documentation
 * @see {@link https://axios-http.com/} Axios Documentation
 * @see {@link hooks/useMovieList.ts} Movie list data fetching hook
 * @see {@link hooks/useCurrentUser.ts} User authentication data hook
 */

import axios from 'axios';

/**
 * SWR-Compatible Data Fetcher Function
 *
 * This function serves as the core data fetching mechanism for the streaming platform's
 * client-side data management. It's specifically designed to work with SWR (Stale-While-Revalidate)
 * to provide efficient caching, background updates, and real-time data synchronization.
 *
 * Why this fetcher is essential for the streaming platform:
 * - Performance Optimization: Enables SWR's intelligent caching to reduce API calls
 * - Real-time Updates: Supports background revalidation for live data updates
 * - Error Handling: Leverages axios's robust error handling for network issues
 * - Type Safety: Provides consistent data extraction for TypeScript support
 * - User Experience: Enables instant data display with background updates
 *
 * SWR Integration Benefits:
 * - Caching: Automatically caches responses to reduce redundant API calls
 * - Revalidation: Intelligently updates data in the background when needed
 * - Loading States: Provides loading indicators during data fetching
 * - Error States: Handles network errors and API failures gracefully
 * - Optimistic Updates: Supports immediate UI updates with background sync
 *
 * Streaming Platform Usage:
 * - Movie Catalog: Fetches movie lists for browsing and discovery interfaces
 * - User Authentication: Retrieves current user data for personalized experiences
 * - Favorites Management: Loads user's favorite movies for personalized content
 * - Random Content: Fetches random movies for billboard and recommendation features
 * - Individual Movies: Retrieves specific movie data for detail views and streaming
 *
 * Implementation Details:
 * - Uses axios.get() for HTTP GET requests to API endpoints
 * - Extracts response.data to provide clean data objects to SWR
 * - Returns a Promise that resolves to the API response data
 * - Handles all HTTP status codes and network errors through axios
 *
 * @param url - API endpoint URL to fetch data from (e.g., '/api/movies', '/api/current')
 * @returns Promise<any> - Resolves to the API response data for SWR consumption
 *
 * @example
 * ```typescript
 * // Used in SWR hooks
 * const { data, error, isLoading } = useSWR('/api/movies', fetcher);
 *
 * // Direct usage
 * const movieData = await fetcher('/api/movies/123');
 * ```
 *
 * @see {@link hooks/useMovieList.ts} Movie list hook using this fetcher
 * @see {@link hooks/useCurrentUser.ts} User authentication hook using this fetcher
 * @see {@link hooks/useFavorites.ts} User favorites hook using this fetcher
 * @see {@link hooks/useBillboard.ts} Random movie hook using this fetcher
 * @see {@link hooks/useMovie.ts} Individual movie hook using this fetcher
 */
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

/**
 * Default Export - SWR Data Fetcher
 *
 * This is the main export that provides the fetcher function to all SWR hooks
 * in the streaming platform. It's imported by every custom hook that needs
 * to fetch data from the platform's API endpoints.
 *
 * Usage Pattern:
 * ```typescript
 * import fetcher from '@/lib/fetcher';
 * import useSWR from 'swr';
 *
 * // In custom hooks
 * const { data, error, isLoading } = useSWR('/api/endpoint', fetcher);
 * ```
 *
 * Streaming Platform Integration:
 * - All SWR hooks use this fetcher for consistent data fetching behavior
 * - Enables efficient caching and real-time updates across the platform
 * - Provides standardized error handling and loading states
 * - Supports the platform's data synchronization requirements
 *
 * @see {@link https://swr.vercel.app/docs/data-fetching} SWR Data Fetching Documentation
 * @see {@link https://axios-http.com/docs/api_intro} Axios API Reference
 */
export default fetcher;
