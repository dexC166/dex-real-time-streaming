/**
 * Billboard Featured Content Hook for DEX Real-Time Streaming Platform
 *
 * This custom React hook fetches a randomly selected movie from the streaming
 * platform's catalog to power the billboard/hero section. It's a critical hook
 * that provides featured content that changes on each request, creating an
 * engaging first impression and introducing users to diverse content.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Uses SWR for efficient data fetching, caching, and performance optimization
 * - Static Data Strategy: Disables revalidation to treat billboard content as relatively static
 * - Random Content: Fetches from /api/random endpoint for dynamic featured content
 * - Performance Focus: Optimized for fast loading of hero section content
 *
 * The streaming platform relies on this hook for:
 * - Billboard Content: Powers the main hero/billboard section with featured movies
 * - User Engagement: Provides fresh content on each page load to maintain interest
 * - Content Discovery: Introduces users to different movies they might not have seen
 * - Visual Appeal: Creates an engaging first impression with dynamic featured content
 *
 * @see {@link pages/api/random.ts} Random movie API endpoint
 * @see {@link components/Billboard.tsx} Hero section component using this hook
 * @see {@link pages/browse.tsx} Main browsing page with billboard
 * @see {@link lib/fetcher.ts} SWR data fetcher function
 */

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

/**
 * Billboard Featured Content Hook
 *
 * This hook fetches a randomly selected movie using SWR for efficient caching
 * and performance optimization. It's the primary way the Billboard component
 * accesses featured content for the hero section of the streaming platform.
 *
 * Why this hook is essential for the streaming platform:
 * - User Engagement: Provides fresh, dynamic content on each page load
 * - Content Discovery: Introduces users to movies they might not have seen
 * - Visual Appeal: Creates an engaging first impression with featured content
 * - Platform Identity: Establishes the streaming platform's content variety
 *
 * SWR Configuration Strategy:
 * - Static Data Approach: Disables revalidation since billboard content is relatively static
 * - Performance Optimization: Prevents unnecessary API calls and re-renders
 * - Caching Benefits: Leverages SWR's intelligent caching for fast subsequent loads
 * - Error Resilience: Handles network failures and API errors gracefully
 *
 * Featured Content Data:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URLs for video playback in hero section
 * - Thumbnail URLs for poster display and video fallback
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Billboard Component: Powers the main hero section with featured content
 * - Browse Page: Provides engaging first impression for content discovery
 * - Video Playback: Enables autoplay video in hero section
 * - Content Discovery: Introduces users to diverse content through randomness
 *
 * @returns {Object} Hook return object with featured movie data and SWR state
 * @returns {Object} data - Randomly selected movie object from /api/random endpoint
 * @returns {Error} error - Network or API error if movie data fetch fails
 * @returns {boolean} isLoading - Loading state during initial data fetching
 *
 * @example
 * ```typescript
 * // Basic usage in Billboard component
 * const { data: featuredMovie, error, isLoading } = useBillboard();
 *
 * if (isLoading) return <div>Loading featured content...</div>;
 * if (error) return <div>Error loading featured content</div>;
 *
 * return (
 *   <div className="hero-section">
 *     <video src={featuredMovie?.videoUrl} autoPlay muted loop />
 *     <h1>{featuredMovie?.title}</h1>
 *     <p>{featuredMovie?.description}</p>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with conditional rendering
 * const { data } = useBillboard();
 *
 * return (
 *   <Billboard>
 *     {data && (
 *       <VideoPlayer
 *         src={data.videoUrl}
 *         poster={data.thumbnailUrl}
 *         title={data.title}
 *       />
 *     )}
 *   </Billboard>
 * );
 * ```
 *
 * @see {@link pages/api/random.ts} Random movie API endpoint
 * @see {@link components/Billboard.tsx} Hero section component
 * @see {@link pages/browse.tsx} Main browsing page
 */
const useBillboard = () => {
  /**
   * SWR Data Fetching Configuration
   *
   * Uses SWR to fetch randomly selected movie data from the /api/random endpoint
   * with optimized configuration for static content. This configuration prioritizes
   * performance and caching over real-time updates since billboard content is
   * relatively static and doesn't need frequent updates.
   *
   * Why this SWR configuration for billboard data:
   * - Static Content: Billboard content doesn't change frequently, so revalidation is disabled
   * - Performance: Prevents unnecessary API calls and component re-renders
   * - Caching: Leverages SWR's intelligent caching for fast subsequent loads
   * - User Experience: Provides instant loading for returning users
   *
   * SWR Options Explained:
   * - revalidateIfStale: false - Prevents revalidation when data becomes stale
   * - revalidateOnFocus: false - Prevents revalidation when window regains focus
   * - revalidateOnReconnect: false - Prevents revalidation when network reconnects
   *
   * Random Content Strategy:
   * - Each page load gets a fresh random movie from the API
   * - Caching prevents excessive API calls during the same session
   * - Static configuration balances freshness with performance
   * - Provides engaging, dynamic content without performance overhead
   *
   * Fetcher Integration:
   * - Uses the platform's standardized fetcher function
   * - Handles HTTP errors and network issues automatically
   * - Provides consistent data extraction for all API calls
   * - Enables SWR's caching and performance features
   */
  const { data, error, isLoading } = useSWR('/api/random', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  /**
   * Hook Return Object
   *
   * Returns the featured movie data and SWR state in a clean, consistent interface
   * that components can easily consume for billboard and hero section display.
   *
   * Return Object Structure:
   * - data: Randomly selected movie object with complete metadata
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
   * - data can be undefined during loading or on error
   * - Components should handle undefined data gracefully
   * - Movie object contains all necessary fields for hero section display
   * - Random selection ensures diverse content on each page load
   */
  return {
    data,
    error,
    isLoading,
  };
};

/**
 * Default Export - Billboard Featured Content Hook
 *
 * This is the main export that provides the useBillboard hook to all
 * components in the streaming platform that need access to featured
 * content for billboard and hero section display.
 *
 * Usage Pattern:
 * ```typescript
 * import useBillboard from '@/hooks/useBillboard';
 *
 * // In React components
 * const { data: featuredMovie, error, isLoading } = useBillboard();
 * ```
 *
 * Streaming Platform Integration:
 * - Billboard component uses this hook for hero section content
 * - Enables dynamic, engaging first impressions
 * - Provides random content discovery for users
 * - Optimized for performance with large movie catalogs
 *
 * @see {@link pages/api/random.ts} Random movie API endpoint
 * @see {@link components/Billboard.tsx} Hero section component
 * @see {@link pages/browse.tsx} Main browsing page
 */
export default useBillboard;
