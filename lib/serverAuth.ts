/**
 * Server-Side Authentication Middleware for DEX Real-Time Streaming Platform
 *
 * This module provides a centralized authentication middleware that validates user
 * sessions and retrieves current user data for protected API routes. It's essential
 * for securing the streaming platform's API endpoints and ensuring only authenticated
 * users can access personalized content and features.
 *
 * Key architectural decisions for the streaming platform:
 * - Centralized Auth Logic: Single source of truth for authentication validation
 * - NextAuth.js Integration: Leverages NextAuth.js session management for multi-provider auth
 * - Database Verification: Double-checks user existence in database for security
 * - Error Handling: Consistent error responses for unauthenticated requests
 *
 * The streaming platform relies on this middleware for:
 * - API Route Protection: Secures all protected endpoints (movies, favorites, user data)
 * - User Context: Provides current user data for personalized content operations
 * - Security: Prevents unauthorized access to streaming content and user preferences
 * - Session Validation: Ensures user sessions are valid and user accounts exist
 *
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 * @see {@link lib/prismadb.ts} Database client for user verification
 * @see {@link https://next-auth.js.org/getting-started/example} NextAuth.js Documentation
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prismadb from '@/lib/prismadb';

/**
 * Server-Side Authentication Middleware Function
 *
 * This function validates user authentication for API routes and returns the current
 * user's data. It's the core security mechanism for the streaming platform's protected
 * endpoints, ensuring only authenticated users can access personalized content.
 *
 * Why this middleware is essential for the streaming platform:
 * - Content Protection: Prevents unauthorized access to streaming content and user data
 * - Personalization: Provides user context for favorites, watchlists, and recommendations
 * - Security: Validates both session existence and user account validity
 * - Consistency: Standardizes authentication across all protected API routes
 *
 * Authentication Flow:
 * 1. Extracts session from NextAuth.js using request/response objects
 * 2. Validates session exists and contains user email
 * 3. Queries database to verify user account still exists
 * 4. Returns current user data for use in API route handlers
 *
 * Streaming Platform Usage:
 * - Movie APIs: Protects movie listing, individual movie, and random movie endpoints
 * - User APIs: Secures favorites, user profile, and preference management
 * - Content APIs: Ensures only authenticated users can access streaming content
 * - Personalization: Provides user data for personalized content recommendations
 *
 * Error Handling:
 * - Throws "Not signed in" error for missing or invalid sessions
 * - Throws "Not signed in" error for non-existent user accounts
 * - API routes catch these errors and return appropriate HTTP status codes
 *
 * @param req - Next.js API request object containing session cookies and headers
 * @param res - Next.js API response object for session validation
 * @returns Promise<{ currentUser: User }> - Current user data from database
 * @throws Error - "Not signed in" if authentication fails at any step
 *
 * @example
 * ```typescript
 * // In an API route
 * try {
 *   const { currentUser } = await serverAuth(req, res);
 *   // Use currentUser for personalized operations
 * } catch (error) {
 *   return res.status(401).json({ error: 'Unauthorized' });
 * }
 * ```
 *
 * @see {@link pages/api/movies/index.ts} Movie listing API using this middleware
 * @see {@link pages/api/favorites.ts} User favorites API using this middleware
 * @see {@link pages/api/current.ts} Current user API using this middleware
 */
const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Session Extraction and Validation
   *
   * Uses NextAuth.js getServerSession to extract the user session from the request.
   * This handles all the complexity of session validation, including JWT verification,
   * cookie parsing, and multi-provider authentication state.
   *
   * Why getServerSession is used:
   * - Server-Side: Works in API routes and server-side rendering contexts
   * - Multi-Provider: Handles OAuth (GitHub, Google) and credentials authentication
   * - Security: Validates JWT tokens and session cookies securely
   * - NextAuth.js Integration: Leverages the configured authOptions for consistency
   */
  const session = await getServerSession(req, res, authOptions);

  /**
   * Session Existence Validation
   *
   * Checks if the session exists and contains a valid user email. This is the first
   * line of defense against unauthenticated requests to protected endpoints.
   *
   * Why this check is crucial for the streaming platform:
   * - Content Security: Prevents unauthorized access to streaming content
   * - User Privacy: Protects user favorites and personal data
   * - API Security: Ensures only authenticated users can access protected endpoints
   * - Error Consistency: Provides clear error message for debugging
   */
  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  /**
   * Database User Verification
   *
   * Queries the database to verify the user account still exists and is valid.
   * This double-check is essential for security because:
   * - Session Persistence: Sessions might persist even after account deletion
   * - Data Integrity: Ensures user data is still available for operations
   * - Security: Prevents access with stale or invalid session data
   * - Consistency: Maintains data consistency between session and database state
   *
   * Why this is important for streaming platforms:
   * - User Management: Handles account deletion and suspension scenarios
   * - Data Security: Ensures user data is valid before allowing access
   * - Error Prevention: Prevents operations on non-existent user accounts
   * - Audit Trail: Maintains proper user verification for compliance
   */
  const currentUser = await prismadb.user.findUnique({
    where: { email: session.user.email },
  });

  /**
   * User Account Validation
   *
   * Final validation to ensure the user account exists in the database. This is
   * the last security check before allowing access to protected resources.
   *
   * Why this final check is necessary:
   * - Account Deletion: Handles cases where user account was deleted after session creation
   * - Data Consistency: Ensures session and database state are synchronized
   * - Security: Prevents access with invalid or stale user references
   * - Error Handling: Provides clear error message for debugging and user feedback
   */
  if (!currentUser) {
    throw new Error('Not signed in');
  }

  /**
   * Return Current User Data
   *
   * Returns the current user's data from the database, which includes all necessary
   * information for personalized operations in the streaming platform.
   *
   * User Data Includes:
   * - Profile Information: name, email, image for UI display
   * - Authentication Data: favoriteIds for personalized content
   * - Account Metadata: createdAt, updatedAt for user management
   * - Preferences: User-specific settings and personalized content lists
   *
   * This data is used by API routes for:
   * - Personalization: Showing user's favorite movies and recommendations
   * - Authorization: Checking user permissions for specific operations
   * - UI Context: Providing user information for frontend display
   * - Data Operations: Performing user-specific database operations
   */
  return { currentUser };
};

/**
 * Default Export - Server Authentication Middleware
 *
 * This is the main export that provides the serverAuth middleware to all protected
 * API routes in the streaming platform. It's imported by every API route that
 * requires user authentication.
 *
 * Usage Pattern:
 * ```typescript
 * import serverAuth from '@/lib/serverAuth';
 *
 * // In API route handler
 * try {
 *   const { currentUser } = await serverAuth(req, res);
 *   // Handle authenticated request
 * } catch (error) {
 *   return res.status(401).json({ error: 'Unauthorized' });
 * }
 * ```
 *
 * Streaming Platform Integration:
 * - All protected API routes use this middleware for authentication
 * - Provides consistent user context across all authenticated endpoints
 * - Enables personalized content operations and user-specific features
 * - Maintains security standards across the entire platform
 *
 * @see {@link pages/api/movies/index.ts} Movie listing API
 * @see {@link pages/api/favorites.ts} User favorites API
 * @see {@link pages/api/current.ts} Current user API
 * @see {@link pages/api/favorite.ts} Favorite management API
 */
export default serverAuth;
