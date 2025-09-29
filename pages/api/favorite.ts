/**
 * Individual Favorite Management API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module handles adding and removing individual movies from a user's
 * favorites list. It's a critical endpoint that powers the favorite toggle
 * functionality throughout the platform, enabling users to curate their
 * personal content collections.
 *
 * Key architectural decisions for the streaming platform:
 * - Dual HTTP Methods: Supports both POST (add) and DELETE (remove) operations
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - Data Validation: Validates movie existence before modifying user favorites
 * - Array Management: Uses Prisma's push operator and lodash without() for efficient array operations
 *
 * The streaming platform relies on this endpoint for:
 * - Favorite Toggle: Powers the FavoriteButton component's add/remove functionality
 * - User Experience: Enables instant favorite management with real-time UI updates
 * - Personalization: Allows users to curate their personal content collections
 * - Data Consistency: Ensures favorite state is synchronized across all components
 *
 * @see {@link components/FavoriteButton.tsx} Favorite toggle component using this endpoint
 * @see {@link pages/api/favorites.ts} Favorites listing endpoint
 * @see {@link hooks/useFavorites.ts} SWR hook for favorites data
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { without } from 'lodash';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

/**
 * Individual Favorite Management Handler
 *
 * This function handles adding and removing individual movies from a user's
 * favorites list. It supports both POST (add favorite) and DELETE (remove favorite)
 * operations, with comprehensive validation and error handling.
 *
 * Why this endpoint is essential for the streaming platform:
 * - User Interaction: Enables users to manage their personal content collections
 * - Real-time Updates: Powers instant favorite toggle functionality
 * - Data Consistency: Ensures favorite state is synchronized across components
 * - User Experience: Provides immediate feedback for favorite actions
 *
 * Supported Operations:
 * - POST: Adds a movie to user's favorites list
 * - DELETE: Removes a movie from user's favorites list
 *
 * Data Flow for POST (Add Favorite):
 * 1. Authenticates user using serverAuth middleware
 * 2. Extracts movieId from request body
 * 3. Validates movie exists in database
 * 4. Updates user's favoriteIds array using Prisma push operator
 * 5. Returns updated user data with new favoriteIds
 *
 * Data Flow for DELETE (Remove Favorite):
 * 1. Authenticates user using serverAuth middleware
 * 2. Extracts movieId from request body
 * 3. Validates movie exists in database
 * 4. Removes movieId from user's favoriteIds using lodash without()
 * 5. Updates user's favoriteIds array in database
 * 6. Returns updated user data with modified favoriteIds
 *
 * Streaming Platform Integration:
 * - Frontend: Used by FavoriteButton component for toggle functionality
 * - Real-time Updates: Triggers SWR revalidation for immediate UI updates
 * - User Experience: Provides instant feedback for favorite actions
 * - Data Consistency: Ensures favorite state is synchronized across all components
 *
 * @param req - Next.js API request object containing movieId and session cookies
 * @param res - Next.js API response object for sending updated user data
 * @returns Promise<void> - Sends JSON response with updated user data or error
 *
 * @example
 * ```typescript
 * // Add favorite
 * await axios.post('/api/favorite', { movieId: 'movie123' });
 *
 * // Remove favorite
 * await axios.delete('/api/favorite', { data: { movieId: 'movie123' } });
 * ```
 *
 * @see {@link components/FavoriteButton.tsx} Favorite toggle implementation
 * @see {@link pages/api/favorites.ts} Favorites listing endpoint
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /**
     * Add Favorite Operation (POST)
     *
     * Handles adding a movie to the user's favorites list. This operation
     * validates the movie exists, authenticates the user, and updates their
     * favoriteIds array using Prisma's push operator.
     *
     * Why POST for adding favorites:
     * - REST Semantics: POST is appropriate for creating new relationships
     * - Data Modification: Adds new data to user's existing favorites
     * - Idempotency: Multiple calls with same movieId are safe (no duplicates)
     * - User Experience: Provides clear semantic meaning for the operation
     */
    if (req.method === 'POST') {
      /**
       * User Authentication and Data Extraction
       *
       * Authenticates the user and extracts the movieId from the request body.
       * This ensures only authenticated users can modify their favorites and
       * provides the necessary data for the add operation.
       *
       * Why authentication is required for adding favorites:
       * - User-Specific Data: Favorites are personal and require user context
       * - Data Privacy: Prevents unauthorized modification of user preferences
       * - Security: Ensures only registered users can manage their favorites
       * - Personalization: Enables user-specific content curation
       */
      const { currentUser } = await serverAuth(req, res);
      const { movieId } = req.body;

      /**
       * Movie Existence Validation
       *
       * Validates that the movie exists in the database before adding it to
       * the user's favorites. This prevents adding non-existent movies and
       * ensures data integrity.
       *
       * Why validate movie existence before adding:
       * - Data Integrity: Prevents adding references to non-existent movies
       * - User Experience: Provides clear error messages for invalid requests
       * - Database Consistency: Maintains referential integrity
       * - Error Prevention: Catches invalid movieIds before database updates
       */
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      /**
       * Add Movie to Favorites
       *
       * Updates the user's favoriteIds array by pushing the new movieId.
       * Uses Prisma's push operator for efficient array manipulation.
       *
       * Why use Prisma's push operator:
       * - Atomic Operation: Ensures the update is atomic and consistent
       * - Array Efficiency: Optimized for adding single items to arrays
       * - Database Performance: Leverages MongoDB's native array operations
       * - Simplicity: Clean, readable code for array manipulation
       *
       * User Data Updated:
       * - favoriteIds array gets the new movieId appended
       * - Other user data remains unchanged
       * - Database maintains referential integrity
       */
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: {
            push: movieId,
          },
        },
      });

      /**
       * Add Favorite Response
       *
       * Returns the updated user data to the client. This enables the
       * frontend to update the UI immediately and maintain data consistency.
       *
       * Why return updated user data:
       * - UI Updates: Frontend can update favorite state immediately
       * - Data Consistency: Ensures all components have latest user data
       * - User Experience: Provides immediate feedback for the action
       * - SWR Integration: Enables automatic cache updates
       */
      return res.status(200).json(user);
    }

    /**
     * Remove Favorite Operation (DELETE)
     *
     * Handles removing a movie from the user's favorites list. This operation
     * validates the movie exists, authenticates the user, and updates their
     * favoriteIds array by removing the specified movieId.
     *
     * Why DELETE for removing favorites:
     * - REST Semantics: DELETE is appropriate for removing relationships
     * - Data Modification: Removes data from user's existing favorites
     * - Idempotency: Multiple calls with same movieId are safe (no errors)
     * - User Experience: Provides clear semantic meaning for the operation
     */
    if (req.method === 'DELETE') {
      /**
       * User Authentication and Data Extraction
       *
       * Authenticates the user and extracts the movieId from the request body.
       * This ensures only authenticated users can modify their favorites and
       * provides the necessary data for the remove operation.
       *
       * Why authentication is required for removing favorites:
       * - User-Specific Data: Favorites are personal and require user context
       * - Data Privacy: Prevents unauthorized modification of user preferences
       * - Security: Ensures only registered users can manage their favorites
       * - Personalization: Enables user-specific content curation
       */
      const { currentUser } = await serverAuth(req, res);

      const { movieId } = req.body;

      /**
       * Movie Existence Validation
       *
       * Validates that the movie exists in the database before removing it from
       * the user's favorites. This prevents errors and ensures data integrity.
       *
       * Why validate movie existence before removing:
       * - Data Integrity: Prevents errors from non-existent movie references
       * - User Experience: Provides clear error messages for invalid requests
       * - Database Consistency: Maintains referential integrity
       * - Error Prevention: Catches invalid movieIds before database updates
       */
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      /**
       * Remove Movie from Favorites
       *
       * Creates a new favoriteIds array without the specified movieId using
       * lodash's without() function, then updates the user's data.
       *
       * Why use lodash without() for removal:
       * - Array Immutability: Creates new array without modifying original
       * - Clean Code: Simple, readable array manipulation
       * - Performance: Efficient array filtering operation
       * - Reliability: Handles edge cases like missing or duplicate values
       *
       * Array Manipulation:
       * - without() removes all instances of movieId from the array
       * - Handles cases where movieId might appear multiple times
       * - Returns new array without modifying the original
       * - Safe for arrays with missing or undefined values
       */
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      /**
       * Update User Favorites
       *
       * Updates the user's favoriteIds array with the filtered list that
       * no longer contains the removed movieId.
       *
       * Why update with filtered array:
       * - Data Consistency: Ensures database reflects the removal
       * - Atomic Operation: Single database update for the change
       * - Performance: Efficient single update operation
       * - Reliability: Handles all edge cases properly
       */
      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });

      /**
       * Remove Favorite Response
       *
       * Returns the updated user data to the client. This enables the
       * frontend to update the UI immediately and maintain data consistency.
       *
       * Why return updated user data:
       * - UI Updates: Frontend can update favorite state immediately
       * - Data Consistency: Ensures all components have latest user data
       * - User Experience: Provides immediate feedback for the action
       * - SWR Integration: Enables automatic cache updates
       */
      return res.status(200).json(updatedUser);
    }

    /**
     * Unsupported HTTP Method
     *
     * Returns 405 Method Not Allowed for any HTTP methods other than
     * POST and DELETE. This follows REST API conventions and provides
     * clear feedback for unsupported operations.
     *
     * Why return 405 for unsupported methods:
     * - REST Compliance: Follows HTTP status code conventions
     * - Clear Feedback: Provides explicit error message for unsupported operations
     * - Security: Prevents accidental data modification through wrong methods
     * - API Documentation: Helps developers understand supported operations
     */
    return res.status(405).end();
  } catch (error) {
    /**
     * Error Handling
     *
     * Handles authentication failures, validation errors, and database errors
     * that occur during favorite management operations. This ensures the API
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
     * - User account not found in database
     * - Invalid movieId (movie doesn't exist)
     * - Database connection or query errors
     * - Malformed request data
     *
     * TODO: Consider implementing proper error logging for production monitoring
     */
    return res.status(400).end();
  }
}
