/**
 * Random Movie API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module provides a randomly selected movie from the streaming platform's
 * catalog. It's a critical endpoint that powers the billboard/hero section
 * of the platform, providing featured content that changes on each request
 * to keep the user experience fresh and engaging.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - Random Selection: Implements true randomness using Math.random() and database counting
 * - Performance Optimized: Uses efficient database queries with count() and pagination
 * - SWR Integration: Designed for efficient caching and real-time updates
 *
 * The streaming platform relies on this endpoint for:
 * - Billboard Content: Powers the main hero/billboard section with featured movies
 * - User Engagement: Provides fresh content on each page load to maintain interest
 * - Content Discovery: Introduces users to different movies they might not have seen
 * - Visual Appeal: Creates an engaging first impression with dynamic featured content
 *
 * @see {@link hooks/useBillboard.ts} SWR hook for consuming this endpoint
 * @see {@link components/Billboard.tsx} Hero section component using this endpoint
 * @see {@link pages/browse.tsx} Main browsing page with billboard
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

/**
 * Random Movie Handler
 *
 * This function retrieves and returns a randomly selected movie from the
 * streaming platform's catalog. It's the primary endpoint for the billboard
 * hero section, providing featured content that changes on each request.
 *
 * Why this endpoint is essential for the streaming platform:
 * - User Engagement: Provides fresh, dynamic content on each page load
 * - Content Discovery: Introduces users to movies they might not have seen
 * - Visual Appeal: Creates an engaging first impression with featured content
 * - Platform Identity: Establishes the streaming platform's content variety
 *
 * Random Selection Algorithm:
 * 1. Counts total number of movies in database
 * 2. Generates random index using Math.random()
 * 3. Uses skip/take pagination to select random movie
 * 4. Returns the selected movie for billboard display
 *
 * Data Flow:
 * 1. Validates HTTP method is GET
 * 2. Authenticates user using serverAuth middleware
 * 3. Counts total movies in database
 * 4. Generates random index within movie count range
 * 5. Queries database for movie at random index
 * 6. Returns single random movie as JSON
 * 7. Handles authentication and database errors gracefully
 *
 * Movie Data Provided:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URL for video playback in billboard
 * - Thumbnail URL for poster display
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Frontend: Used by useBillboard hook for SWR data fetching
 * - Components: Powers Billboard hero section with featured content
 * - User Experience: Provides dynamic, engaging first impression
 * - Content Discovery: Introduces users to diverse content
 *
 * @param req - Next.js API request object containing session cookies
 * @param res - Next.js API response object for sending random movie data
 * @returns Promise<void> - Sends JSON response with random movie or error
 *
 * @example
 * ```typescript
 * // Frontend usage with SWR
 * const { data: randomMovie, error, isLoading } = useBillboard();
 *
 * // Direct API call
 * const response = await fetch('/api/random');
 * const randomMovie = await response.json();
 * ```
 *
 * @see {@link hooks/useBillboard.ts} SWR hook implementation
 * @see {@link components/Billboard.tsx} Hero section component
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * HTTP Method Validation
   *
   * Ensures only GET requests are processed for random movie retrieval. This
   * follows REST API conventions and prevents accidental data modification.
   *
   * Why GET for random movie data:
   * - Read-Only: Random movie selection should not modify any data
   * - Caching: GET requests can be cached by browsers and CDNs
   * - Semantics: GET is the appropriate HTTP method for data retrieval
   * - Security: Prevents accidental data modification through wrong HTTP methods
   */
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    /**
     * User Authentication
     *
     * Authenticates the user using serverAuth middleware to ensure only
     * authenticated users can access random movie data. This protects
     * the streaming content and ensures proper user context.
     *
     * Why authentication is required for random movies:
     * - Content Protection: Prevents unauthorized access to streaming content
     * - User Context: Enables personalized features and analytics
     * - Security: Ensures only registered users can access the platform
     * - Engagement Tracking: Allows monitoring of user interaction with featured content
     *
     * Authentication Process:
     * - Validates user session and JWT tokens
     * - Verifies user account exists in database
     * - Provides user context for personalized features
     * - Throws error if authentication fails
     */
    await serverAuth(req, res);

    /**
     * Movie Count Retrieval
     *
     * Counts the total number of movies in the database to determine the
     * range for random selection. This ensures the random index is within
     * valid bounds and prevents database errors.
     *
     * Why count movies before random selection:
     * - Range Validation: Ensures random index is within valid movie count
     * - Error Prevention: Prevents database queries with invalid skip values
     * - Performance: Count query is fast and efficient
     * - Accuracy: Ensures true randomness across all available movies
     *
     * Database Performance:
     * - count() is optimized for fast counting operations
     * - No data transfer, only returns a number
     * - Indexed on primary key for maximum efficiency
     */
    const movieCount = await prismadb.movie.count();

    /**
     * Random Index Generation
     *
     * Generates a random index within the valid range of movie counts.
     * This ensures the random selection is truly random and within bounds.
     *
     * Why Math.floor(Math.random() * movieCount):
     * - True Randomness: Math.random() provides uniform distribution
     * - Bounds Safety: Ensures index is always within valid range (0 to movieCount-1)
     * - Integer Index: Math.floor() converts to integer for database skip parameter
     * - Performance: Simple calculation with no external dependencies
     *
     * Random Distribution:
     * - Each movie has equal probability of being selected
     * - No bias toward any particular movie or position
     * - Fresh content on each request
     */
    const randomIndex = Math.floor(Math.random() * movieCount);

    /**
     * Random Movie Retrieval
     *
     * Queries the database to retrieve the movie at the randomly selected
     * index. Uses skip/take pagination for efficient random selection.
     *
     * Why findMany with skip/take for random selection:
     * - Efficient Pagination: Skip/take is optimized for pagination queries
     * - Single Record: take: 1 ensures only one movie is returned
     * - Random Access: skip: randomIndex selects movie at random position
     * - Database Performance: Leverages database indexing for fast retrieval
     *
     * Query Optimization:
     * - Uses database-level pagination for efficiency
     * - Leverages primary key indexing for fast skip operations
     * - Returns only necessary data (single movie)
     * - Compatible with MongoDB's skip/limit operations
     */
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    /**
     * Random Movie Response
     *
     * Returns the randomly selected movie to the client. This enables
     * the billboard component to display featured content that changes
     * on each request, keeping the user experience fresh and engaging.
     *
     * Why return randomMovies[0]:
     * - Single Movie: findMany returns array, but we only need one movie
     * - Array Access: [0] extracts the first (and only) movie from results
     * - Type Safety: Ensures consistent single movie object response
     * - Performance: Minimal data transfer for billboard display
     *
     * Response Format:
     * - JSON object containing complete random movie data
     * - Includes all fields from Movie model in Prisma schema
     * - Compatible with Billboard component expectations
     * - Ready for SWR caching and real-time updates
     */
    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    /**
     * Error Handling
     *
     * Handles authentication failures and database errors that occur during
     * random movie retrieval. This ensures the API doesn't crash and provides
     * appropriate error responses to the client.
     *
     * Why this error handling approach:
     * - User Experience: Prevents API crashes from affecting frontend
     * - Security: Doesn't expose sensitive error information
     * - Debugging: Provides error context for development troubleshooting
     * - Graceful Degradation: Allows frontend to handle errors gracefully
     *
     * Error Scenarios:
     * - Unauthenticated requests (no valid session)
     * - Invalid or expired JWT tokens
     * - Database connection or query errors
     * - Empty movie catalog (count = 0)
     * - Database timeout or performance issues
     *
     * TODO: Consider implementing proper error logging for production monitoring
     */
    return res.status(400).end();
  }
}
