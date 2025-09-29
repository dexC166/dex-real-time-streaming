/**
 * Movie Catalog API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module provides the complete movie catalog to authenticated users of the
 * streaming platform. It's the primary endpoint for content discovery, enabling
 * users to browse the entire collection of available movies for streaming.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - Complete Catalog: Returns all movies in the database for comprehensive browsing
 * - Performance Optimized: Simple query structure for fast response times
 * - SWR Integration: Designed for efficient caching and real-time updates
 *
 * The streaming platform relies on this endpoint for:
 * - Content Discovery: Powers the main browsing interface and movie grids
 * - User Experience: Enables users to explore the complete movie catalog
 * - Personalization: Provides data for recommendation algorithms and favorites
 * - Performance: Optimized for fast loading of large movie collections
 *
 * @see {@link hooks/useMovieList.ts} SWR hook for consuming this endpoint
 * @see {@link pages/browse.tsx} Main browsing page using this endpoint
 * @see {@link components/MovieList.tsx} Movie grid component
 * @see {@link components/MovieCard.tsx} Individual movie display component
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

/**
 * Movie Catalog Handler
 *
 * This function retrieves and returns the complete movie catalog from the database.
 * It's the primary endpoint for content discovery in the streaming platform,
 * providing all available movies for browsing, searching, and personalization.
 *
 * Why this endpoint is essential for the streaming platform:
 * - Content Discovery: Enables users to explore the complete movie catalog
 * - User Experience: Powers the main browsing interface and movie grids
 * - Personalization: Provides data for recommendation systems and favorites
 * - Performance: Optimized for fast loading of large movie collections
 *
 * Data Flow:
 * 1. Validates HTTP method is GET
 * 2. Authenticates user using serverAuth middleware
 * 3. Queries database for all movies using Prisma
 * 4. Returns complete movie catalog as JSON
 * 5. Handles authentication and database errors gracefully
 *
 * Movie Data Provided:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URLs for video playback
 * - Thumbnail URLs for UI display
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Frontend: Used by useMovieList hook for SWR data fetching
 * - Components: Powers MovieList, MovieCard, and browsing interfaces
 * - Personalization: Enables recommendation algorithms and favorites
 * - Performance: Optimized for fast loading and efficient caching
 *
 * @param req - Next.js API request object containing session cookies
 * @param res - Next.js API response object for sending movie data
 * @returns Promise<void> - Sends JSON response with movie catalog or error
 *
 * @example
 * ```typescript
 * // Frontend usage with SWR
 * const { data: movies, error, isLoading } = useMovieList();
 *
 * // Direct API call
 * const response = await fetch('/api/movies');
 * const movies = await response.json();
 * ```
 *
 * @see {@link hooks/useMovieList.ts} SWR hook implementation
 * @see {@link pages/browse.tsx} Main browsing page
 * @see {@link components/MovieList.tsx} Movie grid component
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * HTTP Method Validation
   *
   * Ensures only GET requests are processed for movie catalog retrieval. This
   * follows REST API conventions and prevents accidental data modification.
   *
   * Why GET for movie catalog:
   * - Read-Only: Movie catalog retrieval should not modify any data
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
     * authenticated users can access the movie catalog. This protects
     * the streaming content and ensures proper user context.
     *
     * Why authentication is required for movie catalog:
     * - Content Protection: Prevents unauthorized access to streaming content
     * - User Context: Enables personalized features and recommendations
     * - Security: Ensures only registered users can access the platform
     * - Analytics: Allows tracking of user engagement with content
     *
     * Authentication Process:
     * - Validates user session and JWT tokens
     * - Verifies user account exists in database
     * - Provides user context for personalized features
     * - Throws error if authentication fails
     */
    await serverAuth(req, res);

    /**
     * Movie Catalog Retrieval
     *
     * Queries the database to retrieve all movies in the catalog. This
     * provides the complete collection of available content for the
     * streaming platform.
     *
     * Why findMany() for complete catalog:
     * - Complete Discovery: Users need access to all available content
     * - Browsing Experience: Enables comprehensive content exploration
     * - Personalization: Provides data for recommendation algorithms
     * - Performance: Simple query structure for fast response times
     *
     * Movie Data Retrieved:
     * - All fields from Movie model in Prisma schema
     * - Complete metadata for each movie
     * - Streaming URLs and thumbnail URLs
     * - Genre and duration information
     * - All movies regardless of user preferences
     */
    const movies = await prismadb.movie.findMany();

    /**
     * Movie Catalog Response
     *
     * Returns the complete movie catalog to the client. This enables
     * frontend components to display the full collection of available
     * movies for browsing and personalization.
     *
     * Why return complete catalog:
     * - User Experience: Enables comprehensive content discovery
     * - Browsing Interface: Powers movie grids and browsing components
     * - Personalization: Provides data for recommendation systems
     * - Performance: Single request provides all necessary movie data
     *
     * Response Format:
     * - JSON array containing all movie objects
     * - Includes all fields from Movie model in Prisma schema
     * - Compatible with frontend component expectations
     * - Ready for SWR caching and real-time updates
     */
    return res.status(200).json(movies);
  } catch (error) {
    /**
     * Error Handling
     *
     * Handles authentication failures and database errors that occur during
     * movie catalog retrieval. This ensures the API doesn't crash and provides
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
     *
     * TODO: Consider implementing proper error logging for production monitoring
     */
    return res.status(400).end();
  }
}
