/**
 * Current User API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module provides the current authenticated user's data to the frontend
 * components. It's a critical endpoint that enables personalized user experiences
 * throughout the streaming platform by providing user context for UI components
 * and personalization features.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Required: Uses serverAuth middleware to ensure only authenticated users
 * - User Context: Provides complete user profile data for personalization
 * - Real-time Updates: Enables SWR caching for efficient data synchronization
 * - Security: Validates user sessions and database consistency
 *
 * The streaming platform relies on this endpoint for:
 * - User Profile Display: Shows user information in AccountMenu and profile components
 * - Personalization: Enables user-specific features like favorites and recommendations
 * - Authentication State: Provides current user context for protected components
 * - UI Customization: Allows personalized experiences based on user data
 *
 * @see {@link hooks/useCurrentUser.ts} SWR hook for consuming this endpoint
 * @see {@link components/AccountMenu.tsx} User profile display component
 * @see {@link pages/profiles.tsx} User profile management page
 * @see {@link components/FavoriteButton.tsx} User-specific favorite functionality
 * @see {@link lib/serverAuth.ts} Authentication middleware used by this endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/lib/serverAuth';

/**
 * Current User Data Handler
 *
 * This function retrieves and returns the current authenticated user's complete
 * profile data. It's the primary endpoint for frontend components that need
 * user context for personalization and authentication state management.
 *
 * Why this endpoint is essential for the streaming platform:
 * - User Experience: Enables personalized content and UI based on user data
 * - Authentication State: Provides real-time user authentication status
 * - Personalization: Powers user-specific features like favorites and watchlists
 * - Component Context: Supplies user data to React components throughout the app
 *
 * Data Flow:
 * 1. Validates HTTP method is GET
 * 2. Uses serverAuth middleware to authenticate and retrieve user data
 * 3. Returns complete user profile with all necessary information
 * 4. Handles authentication errors gracefully
 *
 * User Data Provided:
 * - Profile Information: name, email, image for UI display
 * - Authentication Data: favoriteIds for personalized content
 * - Account Metadata: createdAt, updatedAt for user management
 * - Preferences: User-specific settings and personalized content lists
 *
 * Streaming Platform Integration:
 * - Frontend: Used by useCurrentUser hook for SWR data fetching
 * - Components: Powers AccountMenu, FavoriteButton, and profile pages
 * - Personalization: Enables user-specific content recommendations
 * - Authentication: Provides user context for protected features
 *
 * @param req - Next.js API request object containing session cookies
 * @param res - Next.js API response object for sending user data
 * @returns Promise<void> - Sends JSON response with current user data or error
 *
 * @example
 * ```typescript
 * // Frontend usage with SWR
 * const { data: user, error, isLoading } = useCurrentUser();
 *
 * // Direct API call
 * const response = await fetch('/api/current');
 * const user = await response.json();
 * ```
 *
 * @see {@link hooks/useCurrentUser.ts} SWR hook implementation
 * @see {@link components/AccountMenu.tsx} User profile display
 * @see {@link lib/serverAuth.ts} Authentication middleware
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * HTTP Method Validation
   *
   * Ensures only GET requests are processed for user data retrieval. This
   * follows REST API conventions and prevents accidental data modification.
   *
   * Why GET for current user data:
   * - Read-Only: User data retrieval should not modify any data
   * - Caching: GET requests can be cached by browsers and CDNs
   * - Semantics: GET is the appropriate HTTP method for data retrieval
   * - Security: Prevents accidental data modification through wrong HTTP methods
   */
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    /**
     * User Authentication and Data Retrieval
     *
     * Uses the serverAuth middleware to authenticate the user and retrieve
     * their complete profile data from the database. This ensures the user
     * is properly authenticated and their data is current and valid.
     *
     * Why serverAuth middleware is used:
     * - Authentication: Validates user session and JWT tokens
     * - Database Verification: Ensures user account still exists
     * - Security: Prevents unauthorized access to user data
     * - Data Consistency: Provides fresh user data from database
     *
     * User Data Retrieved:
     * - Complete user profile with all fields from Prisma schema
     * - Current favoriteIds for personalized content
     * - Profile information for UI display
     * - Account metadata for user management
     */
    const { currentUser } = await serverAuth(req, res);

    /**
     * User Data Response
     *
     * Returns the complete user profile data to the client. This enables
     * frontend components to access user information for personalization
     * and authentication state management.
     *
     * Why return complete user data:
     * - Frontend Needs: Components need access to all user information
     * - Personalization: Enables user-specific features and content
     * - Authentication State: Provides user context for protected features
     * - Performance: Single request provides all necessary user data
     *
     * Response Format:
     * - JSON object containing complete user profile
     * - Includes all fields from User model in Prisma schema
     * - Compatible with frontend component expectations
     * - Ready for SWR caching and real-time updates
     */
    return res.status(200).json(currentUser);
  } catch (error) {
    /**
     * Authentication Error Handling
     *
     * Handles authentication failures and other errors that occur during
     * user data retrieval. This ensures the API doesn't crash and provides
     * appropriate error responses to the client.
     *
     * Why this error handling approach:
     * - User Experience: Prevents API crashes from affecting frontend
     * - Security: Doesn't expose sensitive error information
     * - Debugging: Provides error context for development troubleshooting
     * - Graceful Degradation: Allows frontend to handle authentication failures
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
