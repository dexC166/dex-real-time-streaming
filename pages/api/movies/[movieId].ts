/**
 * Individual Movie API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module provides detailed information for a specific movie by its ID.
 * It's a critical endpoint that enables detailed movie views, streaming
 * functionality, and interactive features like favorites and info modals.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - Dynamic Routing: Uses Next.js dynamic routes with [movieId] parameter
 * - Input Validation: Validates movieId parameter type and existence
 * - Error Handling: Provides consistent error responses for invalid requests
 *
 * The streaming platform relies on this endpoint for:
 * - Movie Details: Powers detailed movie views and info modals
 * - Video Streaming: Provides streaming URLs for video playback
 * - Interactive Features: Enables favorites, play buttons, and user interactions
 * - User Experience: Supports detailed movie information display
 *
 * @see {@link hooks/useMovie.ts} SWR hook for consuming this endpoint
 * @see {@link pages/watch/[movieId].tsx} Video streaming page using this endpoint
 * @see {@link components/InfoModal.tsx} Movie info modal component
 * @see {@link components/FavoriteButton.tsx} Favorite functionality
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

/**
 * Individual Movie Handler
 *
 * This function retrieves and returns detailed information for a specific movie
 * by its ID. It's the primary endpoint for movie detail views, streaming
 * functionality, and interactive features in the streaming platform.
 *
 * Why this endpoint is essential for the streaming platform:
 * - Movie Details: Enables detailed movie information display and streaming
 * - User Experience: Powers interactive features like favorites and play buttons
 * - Content Access: Provides streaming URLs and metadata for video playback
 * - Personalization: Enables user-specific interactions with individual movies
 *
 * Data Flow:
 * 1. Validates HTTP method is GET
 * 2. Authenticates user using serverAuth middleware
 * 3. Extracts movieId from URL query parameters
 * 4. Validates movieId parameter type and existence
 * 5. Queries database for specific movie using Prisma
 * 6. Validates movie exists in database
 * 7. Returns complete movie data as JSON
 * 8. Handles authentication and validation errors gracefully
 *
 * Movie Data Provided:
 * - Complete movie metadata (title, description, genre, duration)
 * - Streaming URL for video playback
 * - Thumbnail URL for UI display
 * - All fields from the Movie model in Prisma schema
 *
 * Streaming Platform Integration:
 * - Frontend: Used by useMovie hook for SWR data fetching
 * - Components: Powers InfoModal, watch page, and interactive features
 * - Streaming: Provides video URLs for playback functionality
 * - Personalization: Enables user-specific movie interactions
 *
 * @param req - Next.js API request object containing movieId in query parameters
 * @param res - Next.js API response object for sending movie data
 * @returns Promise<void> - Sends JSON response with movie data or error
 *
 * @example
 * ```typescript
 * // Frontend usage with SWR
 * const { data: movie, error, isLoading } = useMovie(movieId);
 *
 * // Direct API call
 * const response = await fetch(`/api/movies/${movieId}`);
 * const movie = await response.json();
 * ```
 *
 * @see {@link hooks/useMovie.ts} SWR hook implementation
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 * @see {@link components/InfoModal.tsx} Movie info modal
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * HTTP Method Validation
   *
   * Ensures only GET requests are processed for individual movie retrieval. This
   * follows REST API conventions and prevents accidental data modification.
   *
   * Why GET for individual movie data:
   * - Read-Only: Movie data retrieval should not modify any data
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
     * authenticated users can access individual movie data. This protects
     * the streaming content and ensures proper user context.
     *
     * Why authentication is required for individual movies:
     * - Content Protection: Prevents unauthorized access to streaming content
     * - User Context: Enables personalized features and interactions
     * - Security: Ensures only registered users can access movie details
     * - Analytics: Allows tracking of user engagement with specific content
     *
     * Authentication Process:
     * - Validates user session and JWT tokens
     * - Verifies user account exists in database
     * - Provides user context for personalized features
     * - Throws error if authentication fails
     */
    await serverAuth(req, res);

    /**
     * Movie ID Parameter Extraction
     *
     * Extracts the movieId from the URL query parameters. This is the
     * dynamic route parameter that identifies which specific movie to retrieve.
     *
     * Why extract movieId from query:
     * - Dynamic Routing: Next.js [movieId] route provides the ID in req.query
     * - URL Structure: Enables clean URLs like /api/movies/123
     * - Parameter Access: Provides the movie identifier for database queries
     * - Type Safety: Enables validation of the parameter type
     */
    const { movieId } = req.query;

    /**
     * Movie ID Type Validation
     *
     * Ensures the movieId parameter is a string type. This prevents
     * type-related errors and ensures proper database querying.
     *
     * Why validate movieId type:
     * - Type Safety: Prevents runtime errors from incorrect parameter types
     * - Database Compatibility: Ensures movieId is compatible with Prisma queries
     * - Error Prevention: Catches malformed requests before database access
     * - User Experience: Provides clear error messages for invalid requests
     */
    if (typeof movieId !== 'string') {
      throw new Error('Invalid ID');
    }

    /**
     * Movie ID Existence Validation
     *
     * Ensures the movieId parameter exists and is not empty. This prevents
     * database queries with undefined or empty values.
     *
     * Why validate movieId existence:
     * - Data Integrity: Prevents queries with undefined or empty values
     * - Database Performance: Avoids unnecessary database queries
     * - Error Prevention: Catches missing parameters before processing
     * - User Experience: Provides clear error messages for invalid requests
     */
    if (!movieId) {
      throw new Error('Invalid ID');
    }

    /**
     * Individual Movie Retrieval
     *
     * Queries the database to retrieve the specific movie by its ID. This
     * provides detailed information for the requested movie.
     *
     * Why findUnique() for individual movie:
     * - Specific Lookup: Retrieves only the requested movie by ID
     * - Performance: Efficient single-record query
     * - Data Completeness: Returns all fields for the specific movie
     * - Error Handling: Returns null if movie doesn't exist
     *
     * Movie Data Retrieved:
     * - Complete movie metadata from Prisma schema
     * - Streaming URL for video playback
     * - Thumbnail URL for UI display
     * - Genre, duration, and description information
     */
    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    /**
     * Movie Existence Validation
     *
     * Ensures the requested movie exists in the database. This prevents
     * returning null values and provides clear error feedback.
     *
     * Why validate movie existence:
     * - Data Integrity: Ensures the requested movie actually exists
     * - User Experience: Provides clear error messages for non-existent movies
     * - Error Prevention: Prevents null values from being returned
     * - Security: Prevents information leakage about database contents
     */
    if (!movie) {
      throw new Error('Invalid ID');
    }

    /**
     * Movie Data Response
     *
     * Returns the complete movie data to the client. This enables
     * frontend components to display detailed movie information and
     * enable streaming functionality.
     *
     * Why return complete movie data:
     * - User Experience: Enables detailed movie information display
     * - Streaming: Provides video URLs for playback functionality
     * - Interactions: Enables favorites, play buttons, and other features
     * - Performance: Single request provides all necessary movie data
     *
     * Response Format:
     * - JSON object containing complete movie data
     * - Includes all fields from Movie model in Prisma schema
     * - Compatible with frontend component expectations
     * - Ready for SWR caching and real-time updates
     */
    return res.status(200).json(movie);
  } catch (error) {
    /**
     * Error Handling
     *
     * Handles authentication failures, validation errors, and database errors
     * that occur during individual movie retrieval. This ensures the API
     * doesn't crash and provides appropriate error responses to the client.
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
     * - Invalid movieId parameter (wrong type or missing)
     * - Movie not found in database
     * - Database connection or query errors
     *
     * TODO: Consider implementing proper error logging for production monitoring
     */
    return res.status(400).end();
  }
}
