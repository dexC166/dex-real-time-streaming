/**
 * Individual Movie Data Hook for DEX Real-Time Streaming Platform
 *
 * This custom React hook fetches detailed information for a specific movie
 * by its ID from the streaming platform's API. It's a critical hook that
 * powers movie detail views, streaming functionality, and interactive
 * features like info modals and video playback.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Uses SWR for efficient data fetching, caching, and performance optimization
 * - Conditional Fetching: Only fetches data when a valid movie ID is provided
 * - Static Data Strategy: Disables revalidation to treat movie data as relatively static content
 * - Performance Focus: Optimized for fast loading of individual movie details
 *
 * The streaming platform relies on this hook for:
 * - Movie Details: Powers detailed movie views and info modals
 * - Video Streaming: Provides streaming URLs for video playback
 * - Interactive Features: Enables favorites, play buttons, and user interactions
 * - User Experience: Supports detailed movie information display
 *
 * @see {@link pages/api/movies/[movieId].ts} Individual movie API endpoint
 * @see {@link pages/watch/[movieId].tsx} Video streaming page using this hook
 * @see {@link components/InfoModal.tsx} Movie info modal component
 * @see {@link components/FavoriteButton.tsx} Favorite functionality
 * @see {@link lib/fetcher.ts} SWR data fetcher function
 */

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

/**
 * Individual Movie Data Hook
 *
 * This hook fetches detailed information for a specific movie using SWR for
 * efficient caching and performance optimization. It's the primary way
 * components access individual movie data for detail views, streaming,
 * and interactive features.
 *
 * Why this hook is essential for the streaming platform:
 * - Movie Details: Enables detailed movie information display and streaming
 * - User Experience: Powers interactive features like favorites and play buttons
 * - Content Access: Provides streaming URLs and metadata for video playback
 * - Personalization: Enables user-specific interactions with individual movies
 *
 * SWR Configuration Strategy:
 * - Conditional Fetching: Only fetches when a valid movie ID is provided
 * - Static Data Approach: Disables revalidation since movie data is relatively static
 * - Performance Optimization: Prevents unnecessary API calls and re-renders
 * - Caching Benefits: Leverages SWR's intelligent caching for fast subsequent loads
 *
 * Movie Data Provided:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URL for video playback
 * - Thumbnail URL for UI display and video fallback
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Watch Page: Powers video streaming and movie detail display
 * - InfoModal: Provides movie data for detailed information modals
 * - Interactive Features: Enables favorites, play buttons, and user interactions
 * - Content Discovery: Supports detailed movie information for user decisions
 *
 * @param id - Optional movie ID string for fetching specific movie data
 * @returns {Object} Hook return object with movie data and SWR state
 * @returns {Object} data - Individual movie object from /api/movies/[id] endpoint
 * @returns {Error} error - Network or API error if movie data fetch fails
 * @returns {boolean} isLoading - Loading state during initial data fetching
 *
 * @example
 * ```typescript
 * // Basic usage with movie ID
 * const { data: movie, error, isLoading } = useMovie(movieId);
 *
 * if (isLoading) return <div>Loading movie...</div>;
 * if (error) return <div>Error loading movie</div>;
 *
 * return (
 *   <div>
 *     <h1>{movie?.title}</h1>
 *     <video src={movie?.videoUrl} controls />
 *     <p>{movie?.description}</p>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Conditional usage with router query
 * const { movieId } = useRouter().query;
 * const { data: movie } = useMovie(movieId as string);
 *
 * return (
 *   <WatchPage>
 *     {movie && (
 *       <VideoPlayer
 *         src={movie.videoUrl}
 *         title={movie.title}
 *         poster={movie.thumbnailUrl}
 *       />
 *     )}
 *   </WatchPage>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in InfoModal component
 * const { movieId } = useInfoModal();
 * const { data: movie } = useMovie(movieId);
 *
 * return (
 *   <InfoModal>
 *     <MovieDetails movie={movie} />
 *     <PlayButton movieId={movie?.id} />
 *     <FavoriteButton movieId={movie?.id} />
 *   </InfoModal>
 * );
 * ```
 *
 * @see {@link pages/api/movies/[movieId].ts} Individual movie API endpoint
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 * @see {@link components/InfoModal.tsx} Movie info modal
 * @see {@link components/FavoriteButton.tsx} Favorite functionality
 */
const useMovie = (id?: string) => {
  /**
   * SWR Data Fetching Configuration
   *
   * Uses SWR to fetch individual movie data from the /api/movies/[id] endpoint
   * with conditional fetching and optimized configuration for static content.
   * This configuration prioritizes performance and caching over real-time
   * updates since individual movie data is relatively static.
   *
   * Why this SWR configuration for individual movie data:
   * - Conditional Fetching: Only fetches when a valid movie ID is provided
   * - Static Content: Individual movie data doesn't change frequently, so revalidation is disabled
   * - Performance: Prevents unnecessary API calls and component re-renders
   * - Caching: Leverages SWR's intelligent caching for fast subsequent loads
   *
   * SWR Options Explained:
   * - revalidateIfStale: false - Prevents revalidation when data becomes stale
   * - revalidateOnFocus: false - Prevents revalidation when window regains focus
   * - revalidateOnReconnect: false - Prevents revalidation when network reconnects
   *
   * Conditional Fetching Strategy:
   * - id ? `/api/movies/${id}` : null - Only fetches when ID is provided
   * - Prevents unnecessary API calls when no movie is selected
   * - Enables dynamic movie selection based on user interactions
   * - Supports both required and optional movie ID scenarios
   *
   * Fetcher Integration:
   * - Uses the platform's standardized fetcher function
   * - Handles HTTP errors and network issues automatically
   * - Provides consistent data extraction for all API calls
   * - Enables SWR's caching and performance features
   */
  const { data, error, isLoading } = useSWR(
    id ? `/api/movies/${id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  /**
   * Hook Return Object
   *
   * Returns the individual movie data and SWR state in a clean, consistent
   * interface that components can easily consume for movie detail views,
   * streaming functionality, and interactive features.
   *
   * Return Object Structure:
   * - data: Individual movie object with complete metadata (can be undefined)
   * - error: Network or API error if movie data fetch fails
   * - isLoading: Boolean indicating if movie data is currently being fetched
   *
   * Why this return structure:
   * - Consistency: Matches SWR's standard return pattern
   * - Flexibility: Provides all necessary data for different use cases
   * - Performance: Enables components to optimize rendering based on state
   * - User Experience: Supports loading states and error handling
   *
   * Data Characteristics:
   * - data can be undefined during loading, on error, or when no ID is provided
   * - Components should handle undefined data gracefully
   * - Movie object contains all necessary fields for detail views and streaming
   * - Conditional fetching means data is only available when ID is provided
   */
  return {
    data,
    error,
    isLoading,
  };
};

/**
 * Default Export - Individual Movie Hook
 *
 * This is the main export that provides the useMovie hook to all
 * components in the streaming platform that need access to individual
 * movie data for detail views, streaming, and interactive features.
 *
 * Usage Pattern:
 * ```typescript
 * import useMovie from '@/hooks/useMovie';
 *
 * // In React components
 * const { data: movie, error, isLoading } = useMovie(movieId);
 * ```
 *
 * Streaming Platform Integration:
 * - Watch page uses this hook for video streaming
 * - InfoModal component uses this hook for detailed movie information
 * - Interactive features use this hook for movie-specific actions
 * - Optimized for performance with individual movie requests
 *
 * @see {@link pages/api/movies/[movieId].ts} Individual movie API endpoint
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 * @see {@link components/InfoModal.tsx} Movie info modal
 * @see {@link components/FavoriteButton.tsx} Favorite functionality
 */
export default useMovie;
