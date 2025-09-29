/**
 * Movie Catalog Data Hook for DEX Real-Time Streaming Platform
 *
 * This custom React hook fetches and manages the complete movie catalog
 * from the streaming platform's API. It's a critical hook that powers
 * content discovery, browsing interfaces, and personalized content
 * sections throughout the platform.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Uses SWR for efficient data fetching, caching, and performance optimization
 * - Static Data Strategy: Disables revalidation to treat movie catalog as relatively static content
 * - Performance Focus: Optimized for fast loading of large movie collections
 * - Error Handling: Provides loading states and error handling for content fetching failures
 *
 * The streaming platform relies on this hook for:
 * - Content Discovery: Powers the main browsing interface and movie grids
 * - User Experience: Enables users to explore the complete movie catalog
 * - Personalization: Provides data for recommendation algorithms and favorites
 * - Performance: Optimized for fast loading of large movie collections
 *
 * @see {@link pages/api/movies/index.ts} Movie catalog API endpoint
 * @see {@link pages/browse.tsx} Main browsing page using this hook
 * @see {@link components/MovieList.tsx} Movie grid component
 * @see {@link components/MovieCard.tsx} Individual movie display component
 * @see {@link lib/fetcher.ts} SWR data fetcher function
 */

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

/**
 * Movie Catalog Data Hook
 *
 * This hook fetches and manages the complete movie catalog using SWR for
 * efficient caching and performance optimization. It's the primary way
 * components access movie data for content discovery and browsing interfaces.
 *
 * Why this hook is essential for the streaming platform:
 * - Content Discovery: Enables users to explore the complete movie catalog
 * - User Experience: Powers the main browsing interface and movie grids
 * - Personalization: Provides data for recommendation systems and favorites
 * - Performance: Optimized for fast loading of large movie collections
 *
 * SWR Configuration Strategy:
 * - Static Data Approach: Disables revalidation since movie catalog is relatively static
 * - Performance Optimization: Prevents unnecessary API calls and re-renders
 * - Caching Benefits: Leverages SWR's intelligent caching for fast subsequent loads
 * - Error Resilience: Handles network failures and API errors gracefully
 *
 * Movie Data Provided:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URLs for video playback
 * - Thumbnail URLs for UI display
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Browse Page: Powers the main content discovery interface
 * - MovieList Component: Renders movie grids with responsive layouts
 * - MovieCard Component: Displays individual movie information
 * - Personalization: Enables recommendation algorithms and favorites
 *
 * @returns {Object} Hook return object with movie data and SWR state
 * @returns {Array} data - Array of movie objects from /api/movies endpoint (defaults to empty array)
 * @returns {Error} error - Network or API error if movie data fetch fails
 * @returns {boolean} isLoading - Loading state during initial data fetching
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * const { data: movies, error, isLoading } = useMovieList();
 *
 * if (isLoading) return <div>Loading movies...</div>;
 * if (error) return <div>Error loading movies</div>;
 *
 * return (
 *   <div>
 *     {movies.map(movie => (
 *       <MovieCard key={movie.id} data={movie} />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with MovieList component
 * const { data: movies } = useMovieList();
 *
 * return (
 *   <MovieList
 *     title="Trending Now"
 *     data={movies}
 *   />
 * );
 * ```
 *
 * @see {@link pages/api/movies/index.ts} Movie catalog API endpoint
 * @see {@link pages/browse.tsx} Main browsing page
 * @see {@link components/MovieList.tsx} Movie grid component
 * @see {@link components/MovieCard.tsx} Individual movie display
 */
const useMovieList = () => {
  /**
   * SWR Data Fetching Configuration
   *
   * Uses SWR to fetch movie catalog data from the /api/movies endpoint with
   * optimized configuration for static content. This configuration prioritizes
   * performance and caching over real-time updates since movie catalogs are
   * relatively static and don't change frequently.
   *
   * Why this SWR configuration for movie data:
   * - Static Content: Movie catalogs don't change frequently, so revalidation is disabled
   * - Performance: Prevents unnecessary API calls and component re-renders
   * - Caching: Leverages SWR's intelligent caching for fast subsequent loads
   * - User Experience: Provides instant loading for returning users
   *
   * SWR Options Explained:
   * - revalidateIfStale: false - Prevents revalidation when data becomes stale
   * - revalidateOnFocus: false - Prevents revalidation when window regains focus
   * - revalidateOnReconnect: false - Prevents revalidation when network reconnects
   *
   * Fetcher Integration:
   * - Uses the platform's standardized fetcher function
   * - Handles HTTP errors and network issues automatically
   * - Provides consistent data extraction for all API calls
   * - Enables SWR's caching and performance features
   */
  const { data, error, isLoading } = useSWR('/api/movies', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  /**
   * Hook Return Object
   *
   * Returns the movie data and SWR state in a clean, consistent interface
   * that components can easily consume for content discovery and browsing
   * interfaces.
   *
   * Return Object Structure:
   * - data: Array of movie objects with complete metadata (defaults to empty array)
   * - error: Network or API error if movie data fetch fails
   * - isLoading: Boolean indicating if movie data is currently being fetched
   *
   * Why this return structure:
   * - Consistency: Matches SWR's standard return pattern
   * - Safety: Defaults to empty array to prevent rendering errors
   * - Flexibility: Provides all necessary data for different use cases
   * - Performance: Enables components to optimize rendering based on state
   *
   * Data Safety:
   * - data || [] ensures components always receive an array
   * - Prevents "Cannot read property 'map' of undefined" errors
   * - Enables safe iteration in MovieList and other components
   * - Provides consistent data structure for all consumers
   */
  return {
    data: data || [],
    error,
    isLoading,
  };
};

/**
 * Default Export - Movie Catalog Hook
 *
 * This is the main export that provides the useMovieList hook to all
 * components in the streaming platform that need access to movie catalog
 * data for content discovery and browsing interfaces.
 *
 * Usage Pattern:
 * ```typescript
 * import useMovieList from '@/hooks/useMovieList';
 *
 * // In React components
 * const { data: movies, error, isLoading } = useMovieList();
 * ```
 *
 * Streaming Platform Integration:
 * - All content discovery components use this hook for movie data
 * - Enables browsing interfaces throughout the platform
 * - Provides data for personalization and recommendation systems
 * - Optimized for performance with large movie collections
 *
 * @see {@link pages/api/movies/index.ts} Movie catalog API endpoint
 * @see {@link pages/browse.tsx} Main browsing page
 * @see {@link components/MovieList.tsx} Movie grid component
 * @see {@link components/MovieCard.tsx} Individual movie display
 */
export default useMovieList;
