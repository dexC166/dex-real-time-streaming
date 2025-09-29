/**
 * User Favorites API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module retrieves the complete list of movies that a user has marked
 * as favorites. It's a critical endpoint that powers personalized content
 * sections like "My List" and enables users to quickly access their
 * most-loved content.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - User-Specific Data: Retrieves favorites based on current user's favoriteIds
 * - Efficient Querying: Uses Prisma's `in` operator for optimal database performance
 * - SWR Integration: Designed for efficient caching and real-time updates
 *
 * The streaming platform relies on this endpoint for:
 * - Personalized Content: Powers "My List" sections and personalized recommendations
 * - User Experience: Enables quick access to user's favorite content
 * - Content Discovery: Helps users rediscover movies they've previously liked
 * - Engagement: Increases user retention through personalized content curation
 *
 * @see {@link hooks/useFavorites.ts} SWR hook for consuming this endpoint
 * @see {@link pages/browse.tsx} Main browsing page with "My List" section
 * @see {@link components/FavoriteButton.tsx} Favorite toggle functionality
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove endpoint
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

/**
 * User Favorites Handler
 *
 * This function retrieves and returns all movies that the current user has
 * marked as favorites. It's the primary endpoint for personalized content
 * sections and user-specific movie collections.
 *
 * Why this endpoint is essential for the streaming platform:
 * - Personalization: Enables personalized content sections like "My List"
 * - User Experience: Provides quick access to user's favorite content
 * - Content Discovery: Helps users rediscover movies they've previously liked
 * - Engagement: Increases user retention through personalized content curation
 *
 * Data Flow:
 * 1. Validates HTTP method is GET
 * 2. Authenticates user using serverAuth middleware
 * 3. Extracts current user data including favoriteIds array
 * 4. Queries database for movies matching user's favorite IDs
 * 5. Returns complete favorite movies collection as JSON
 * 6. Handles authentication and database errors gracefully
 *
 * Favorites Data Structure:
 * - User's favoriteIds array contains MongoDB ObjectIds of favorite movies
 * - Database query uses Prisma's `in` operator for efficient filtering
 * - Returns complete movie objects with all metadata and streaming URLs
 * - Empty array returned if user has no favorites
 *
 * Streaming Platform Integration:
 * - Frontend: Used by useFavorites hook for SWR data fetching
 * - Components: Powers "My List" sections and personalized content areas
 * - User Experience: Enables quick access to favorite content
 * - Personalization: Provides data for recommendation algorithms
 *
 * @param req - Next.js API request object containing session cookies
 * @param res - Next.js API response object for sending favorite movies data
 * @returns Promise<void> - Sends JSON response with favorite movies or error
 *
 * @example
 * ```typescript
 * // Frontend usage with SWR
 * const { data: favorites, error, isLoading } = useFavorites();
 *
 * // Direct API call
 * const response = await fetch('/api/favorites');
 * const favorites = await response.json();
 * ```
 *
 * @see {@link hooks/useFavorites.ts} SWR hook implementation
 * @see {@link pages/browse.tsx} Main browsing page with favorites
 * @see {@link components/FavoriteButton.tsx} Favorite management
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * HTTP Method Validation
   *
   * Ensures only GET requests are processed for favorites retrieval. This
   * follows REST API conventions and prevents accidental data modification.
   *
   * Why GET for favorites data:
   * - Read-Only: Favorites retrieval should not modify any data
   * - Caching: GET requests can be cached by browsers and CDNs
   * - Semantics: GET is the appropriate HTTP method for data retrieval
   * - Security: Prevents accidental data modification through wrong HTTP methods
   */
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    /**
     * User Authentication and Data Extraction
     *
     * Authenticates the user and extracts their profile data including the
     * favoriteIds array. This ensures only authenticated users can access
     * their personalized favorites and provides the necessary data for
     * querying favorite movies.
     *
     * Why authentication is required for favorites:
     * - Personalization: Favorites are user-specific and require authentication
     * - Data Privacy: Prevents unauthorized access to user's personal preferences
     * - User Context: Enables personalized content recommendations
     * - Security: Ensures only registered users can access their favorites
     *
     * User Data Retrieved:
     * - Complete user profile with favoriteIds array
     * - Authentication context for personalized features
     * - User preferences and personalization data
     * - Account information for database queries
     */
    const { currentUser } = await serverAuth(req, res);

    /**
     * Favorite Movies Retrieval
     *
     * Queries the database to retrieve all movies that match the user's
     * favoriteIds array. Uses Prisma's `in` operator for efficient filtering
     * and returns complete movie objects with all metadata.
     *
     * Why findMany with `in` operator for favorites:
     * - Efficient Filtering: `in` operator is optimized for array-based filtering
     * - Database Performance: Leverages database indexing for fast queries
     * - Complete Data: Returns full movie objects with all metadata
     * - Scalability: Handles large numbers of favorites efficiently
     *
     * Query Optimization:
     * - Uses MongoDB's `$in` operator for efficient array matching
     * - Leverages primary key indexing for fast movie lookups
     * - Returns only movies that exist in user's favorites
     * - Handles empty favorites array gracefully
     *
     * Favorites Data Retrieved:
     * - Complete movie metadata for each favorite
     * - Streaming URLs for video playback
     * - Thumbnail URLs for UI display
     * - Genre, duration, and description information
     */
    const favoriteMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds,
        },
      },
    });

    /**
     * Favorite Movies Response
     *
     * Returns the complete collection of user's favorite movies to the client.
     * This enables frontend components to display personalized content sections
     * and provide quick access to user's most-loved content.
     *
     * Why return complete favorite movies:
     * - User Experience: Enables personalized "My List" sections
     * - Content Discovery: Helps users rediscover their favorite content
     * - Personalization: Provides data for recommendation algorithms
     * - Performance: Single request provides all necessary favorite data
     *
     * Response Format:
     * - JSON array containing complete favorite movie objects
     * - Includes all fields from Movie model in Prisma schema
     * - Compatible with frontend component expectations
     * - Ready for SWR caching and real-time updates
     * - Empty array if user has no favorites
     */
    return res.status(200).json(favoriteMovies);
  } catch (error) {
    /**
     * Error Handling
     *
     * Handles authentication failures and database errors that occur during
     * favorites retrieval. This ensures the API doesn't crash and provides
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
     * - User account not found in database
     * - Database connection or query errors
     * - Malformed favoriteIds array in user data
     *
     * TODO: Consider implementing proper error logging for production monitoring
     */
    return res.status(400).end();
  }
}
