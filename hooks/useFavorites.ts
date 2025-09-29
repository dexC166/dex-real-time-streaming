/**
 * User Favorites Data Hook for DEX Real-Time Streaming Platform
 *
 * This custom React hook fetches and manages the user's favorite movies
 * from the streaming platform's API. It's a critical hook that powers
 * personalized content sections, user engagement features, and real-time
 * updates for favorite management throughout the platform.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Uses SWR for efficient data fetching, caching, and real-time updates
 * - Static Data Strategy: Disables revalidation to treat favorites as relatively static content
 * - Real-time Updates: Includes mutate function for optimistic updates and cache invalidation
 * - Performance Focus: Optimized for fast loading of user's personalized content
 *
 * The streaming platform relies on this hook for:
 * - Personalized Content: Powers "My List" sections and personalized content areas
 * - User Experience: Enables quick access to user's favorite content
 * - Content Discovery: Helps users rediscover movies they've previously liked
 * - Engagement: Increases user retention through personalized content curation
 *
 * @see {@link pages/api/favorites.ts} User favorites API endpoint
 * @see {@link pages/browse.tsx} Main browsing page with "My List" section
 * @see {@link components/FavoriteButton.tsx} Favorite toggle functionality
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove endpoint
 * @see {@link lib/fetcher.ts} SWR data fetcher function
 */

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

/**
 * User Favorites Data Hook
 *
 * This hook fetches and manages the user's favorite movies using SWR for
 * efficient caching and real-time updates. It's the primary way components
 * access user's personalized content for display and interaction features.
 *
 * Why this hook is essential for the streaming platform:
 * - Personalization: Enables personalized content sections like "My List"
 * - User Experience: Provides quick access to user's favorite content
 * - Content Discovery: Helps users rediscover movies they've previously liked
 * - Engagement: Increases user retention through personalized content curation
 *
 * SWR Configuration Strategy:
 * - Static Data Approach: Disables revalidation since favorites are relatively static
 * - Performance Optimization: Prevents unnecessary API calls and re-renders
 * - Caching Benefits: Leverages SWR's intelligent caching for fast subsequent loads
 * - Real-time Updates: Includes mutate function for optimistic updates
 *
 * Favorites Data Provided:
 * - Complete movie metadata for each favorite (title, description, genre, duration)
 * - Streaming URLs for video playback
 * - Thumbnail URLs for UI display
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Browse Page: Powers the "My List" section with user's favorite movies
 * - FavoriteButton: Provides mutate function for real-time cache updates
 * - Personalization: Enables user-specific content recommendations
 * - User Engagement: Creates personalized experiences based on user preferences
 *
 * @returns {Object} Hook return object with favorites data and SWR state
 * @returns {Array} data - Array of favorite movie objects from /api/favorites endpoint (defaults to empty array)
 * @returns {Error} error - Network or API error if favorites data fetch fails
 * @returns {boolean} isLoading - Loading state during initial data fetching
 * @returns {Function} mutate - Function to manually revalidate favorites data for real-time updates
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * const { data: favorites, error, isLoading } = useFavorites();
 *
 * if (isLoading) return <div>Loading favorites...</div>;
 * if (error) return <div>Error loading favorites</div>;
 *
 * return (
 *   <div>
 *     <h2>My List</h2>
 *     {favorites.map(movie => (
 *       <MovieCard key={movie.id} data={movie} />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with MovieList component
 * const { data: favorites } = useFavorites();
 *
 * return (
 *   <MovieList
 *     title="My List"
 *     data={favorites}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with mutate for real-time updates
 * const { data: favorites, mutate } = useFavorites();
 *
 * const addToFavorites = async (movieId) => {
 *   // Optimistic update
 *   mutate([...favorites, newMovie], false);
 *
 *   // API call
 *   await addFavoriteAPI(movieId);
 *
 *   // Revalidate
 *   mutate();
 * };
 * ```
 *
 * @see {@link pages/api/favorites.ts} User favorites API endpoint
 * @see {@link pages/browse.tsx} Main browsing page with favorites
 * @see {@link components/FavoriteButton.tsx} Favorite management
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove endpoint
 */
const useFavorites = () => {
  /**
   * SWR Data Fetching Configuration
   *
   * Uses SWR to fetch user's favorite movies from the /api/favorites endpoint
   * with optimized configuration for static content. This configuration
   * prioritizes performance and caching over real-time updates since
   * favorites are relatively static and don't change frequently.
   *
   * Why this SWR configuration for favorites data:
   * - Static Content: User favorites don't change frequently, so revalidation is disabled
   * - Performance: Prevents unnecessary API calls and component re-renders
   * - Caching: Leverages SWR's intelligent caching for fast subsequent loads
   * - User Experience: Provides instant loading for returning users
   *
   * SWR Options Explained:
   * - revalidateIfStale: false - Prevents revalidation when data becomes stale
   * - revalidateOnFocus: false - Prevents revalidation when window regains focus
   * - revalidateOnReconnect: false - Prevents revalidation when network reconnects
   *
   * Real-time Updates Strategy:
   * - mutate function enables manual cache invalidation for real-time updates
   * - Used by FavoriteButton for optimistic updates when adding/removing favorites
   * - Provides immediate UI feedback while background API calls complete
   * - Ensures data consistency across all components using favorites
   *
   * Fetcher Integration:
   * - Uses the platform's standardized fetcher function
   * - Handles HTTP errors and network issues automatically
   * - Provides consistent data extraction for all API calls
   * - Enables SWR's caching and performance features
   */
  const { data, error, isLoading, mutate } = useSWR('/api/favorites', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  /**
   * Hook Return Object
   *
   * Returns the favorites data and SWR state in a clean, consistent interface
   * that components can easily consume for personalized content display and
   * real-time updates.
   *
   * Return Object Structure:
   * - data: Array of favorite movie objects with complete metadata (defaults to empty array)
   * - error: Network or API error if favorites data fetch fails
   * - isLoading: Boolean indicating if favorites data is currently being fetched
   * - mutate: Function to manually revalidate favorites data for real-time updates
   *
   * Why this return structure:
   * - Consistency: Matches SWR's standard return pattern
   * - Safety: Defaults to empty array to prevent rendering errors
   * - Flexibility: Provides all necessary data for different use cases
   * - Real-time Updates: Includes mutate function for optimistic updates
   *
   * Data Safety:
   * - data || [] ensures components always receive an array
   * - Prevents "Cannot read property 'map' of undefined" errors
   * - Enables safe iteration in MovieList and other components
   * - Provides consistent data structure for all consumers
   *
   * Real-time Update Capabilities:
   * - mutate function enables immediate cache updates
   * - Supports optimistic updates for better user experience
   * - Enables real-time synchronization across components
   * - Provides manual control over data revalidation
   */
  return {
    data: data || [],
    error,
    isLoading,
    mutate,
  };
};

/**
 * Default Export - User Favorites Hook
 *
 * This is the main export that provides the useFavorites hook to all
 * components in the streaming platform that need access to user's
 * favorite movies for personalized content and real-time updates.
 *
 * Usage Pattern:
 * ```typescript
 * import useFavorites from '@/hooks/useFavorites';
 *
 * // In React components
 * const { data: favorites, error, isLoading, mutate } = useFavorites();
 * ```
 *
 * Streaming Platform Integration:
 * - All personalized content components use this hook for favorites data
 * - Enables "My List" sections throughout the platform
 * - Provides real-time updates for favorite management
 * - Optimized for performance with user-specific content
 *
 * @see {@link pages/api/favorites.ts} User favorites API endpoint
 * @see {@link pages/browse.tsx} Main browsing page with favorites
 * @see {@link components/FavoriteButton.tsx} Favorite management
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove endpoint
 */
export default useFavorites;
