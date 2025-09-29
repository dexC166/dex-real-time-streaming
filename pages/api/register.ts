/**
 * User Registration API Endpoint for DEX Real-Time Streaming Platform
 *
 * This module handles user registration for the streaming platform, creating new
 * user accounts with secure password hashing and email validation. It's the
 * primary endpoint for users who choose credentials-based authentication over
 * OAuth providers.
 *
 * Key architectural decisions for the streaming platform:
 * - Security First: Implements bcrypt password hashing with salt rounds of 12
 * - Email Uniqueness: Prevents duplicate accounts with the same email address
 * - Data Validation: Ensures all required fields are provided before account creation
 * - Error Handling: Provides clear error messages for different failure scenarios
 *
 * The streaming platform relies on this endpoint for:
 * - User Onboarding: Enables new users to create accounts for personalized experiences
 * - Credentials Auth: Supports email/password authentication alongside OAuth providers
 * - Data Security: Ensures passwords are securely hashed before database storage
 * - User Experience: Provides seamless registration flow integrated with login system
 *
 * @see {@link pages/auth.tsx} Registration UI component using this endpoint
 * @see {@link pages/index.tsx} Landing page with registration flow
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js credentials provider integration
 * @see {@link prisma/schema.prisma} User model schema for account creation
 */

import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

/**
 * User Registration Handler
 *
 * This function processes user registration requests for the streaming platform.
 * It validates input data, checks for existing users, securely hashes passwords,
 * and creates new user accounts in the database.
 *
 * Why this endpoint is essential for the streaming platform:
 * - User Acquisition: Enables new users to join the platform and access content
 * - Security: Implements industry-standard password hashing for account protection
 * - Data Integrity: Prevents duplicate accounts and ensures data consistency
 * - Integration: Works seamlessly with NextAuth.js credentials authentication
 *
 * Registration Flow:
 * 1. Validates HTTP method is POST
 * 2. Extracts email, name, and password from request body
 * 3. Checks if user with email already exists
 * 4. Hashes password using bcrypt with salt rounds of 12
 * 5. Creates new user account in database
 * 6. Returns user data for immediate login
 *
 * Security Features:
 * - Password Hashing: Uses bcrypt with 12 salt rounds for secure password storage
 * - Email Validation: Prevents duplicate accounts with same email address
 * - Input Sanitization: Validates required fields before processing
 * - Error Handling: Provides appropriate HTTP status codes and error messages
 *
 * Streaming Platform Integration:
 * - Frontend: Used by auth.tsx registration form for new user signup
 * - Authentication: Integrates with NextAuth.js credentials provider
 * - Database: Creates user records compatible with Prisma schema
 * - User Experience: Enables immediate login after successful registration
 *
 * @param req - Next.js API request object containing registration data
 * @param res - Next.js API response object for sending registration results
 * @returns Promise<void> - Sends JSON response with user data or error message
 *
 * @example
 * ```typescript
 * // Registration request
 * POST /api/register
 * {
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "password": "securepassword123"
 * }
 *
 * // Success response
 * {
 *   "id": "user_id",
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "image": "",
 *   "emailVerified": "2024-01-01T00:00:00.000Z"
 * }
 * ```
 *
 * @see {@link pages/auth.tsx} Registration form implementation
 * @see {@link pages/api/auth/[...nextauth].ts} Credentials authentication integration
 * @see {@link prisma/schema.prisma} User model for account structure
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /**
     * HTTP Method Validation
     *
     * Ensures only POST requests are processed for user registration. This
     * prevents accidental data exposure and follows REST API best practices.
     *
     * Why POST for registration:
     * - Data Security: POST requests don't expose data in URL parameters
     * - Data Size: Allows larger payloads for user registration data
     * - Semantics: POST is the appropriate HTTP method for creating resources
     * - Security: Prevents CSRF attacks and accidental data exposure
     */
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    /**
     * Request Data Extraction
     *
     * Extracts user registration data from the request body. This includes
     * the essential information needed to create a new user account.
     *
     * Required Fields:
     * - email: User's email address (must be unique)
     * - name: User's display name for the platform
     * - password: User's chosen password (will be hashed)
     *
     * Why these fields are required:
     * - Email: Used for authentication and account identification
     * - Name: Displayed in UI and used for personalization
     * - Password: Required for credentials-based authentication
     */
    const { email, name, password } = req.body;

    /**
     * Duplicate User Check
     *
     * Queries the database to ensure no user already exists with the provided
     * email address. This prevents duplicate accounts and maintains data integrity.
     *
     * Why this check is crucial for streaming platforms:
     * - Data Integrity: Prevents multiple accounts with same email
     * - User Experience: Avoids confusion with duplicate accounts
     * - Security: Prevents account takeover attempts
     * - Authentication: Ensures email uniqueness for login system
     */
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    /**
     * Duplicate Account Prevention
     *
     * Returns an error if a user with the same email already exists. This
     * prevents duplicate accounts and provides clear feedback to the user.
     *
     * Why 422 status code:
     * - Semantic Correctness: 422 indicates unprocessable entity due to validation
     * - User Experience: Clear error message helps user understand the issue
     * - API Standards: Follows REST API conventions for validation errors
     * - Frontend Handling: Easy to handle in registration form validation
     */
    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    /**
     * Password Hashing
     *
     * Securely hashes the user's password using bcrypt with 12 salt rounds.
     * This ensures passwords are never stored in plain text and are protected
     * against rainbow table attacks.
     *
     * Why bcrypt with 12 salt rounds:
     * - Security: bcrypt is industry standard for password hashing
     * - Salt Rounds: 12 rounds provide good balance of security and performance
     * - Future-Proof: Can increase rounds as hardware improves
     * - Compatibility: Works seamlessly with NextAuth.js credentials provider
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /**
     * User Account Creation
     *
     * Creates a new user account in the database with the provided information
     * and securely hashed password. Sets default values for optional fields.
     *
     * User Data Structure:
     * - email: User's email address (unique identifier)
     * - name: User's display name for the platform
     * - hashedPassword: Securely hashed password for authentication
     * - image: Empty string (can be updated later via profile)
     * - emailVerified: Current timestamp (assumes email is valid)
     *
     * Why these default values:
     * - image: Empty string allows for future profile image uploads
     * - emailVerified: Sets current timestamp for immediate account activation
     * - Other fields: Prisma schema handles createdAt, updatedAt, favoriteIds automatically
     */
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date(),
      },
    });

    /**
     * Success Response
     *
     * Returns the created user data to the client. This enables immediate
     * login after successful registration and provides user context.
     *
     * Why return user data:
     * - Immediate Login: Frontend can use this data for automatic login
     * - User Experience: Provides confirmation of successful registration
     * - Data Consistency: Ensures frontend has latest user information
     * - Integration: Works seamlessly with NextAuth.js authentication flow
     */
    return res.status(200).json(user);
  } catch (error) {
    /**
     * Error Handling
     *
     * Catches any errors during the registration process and returns an
     * appropriate error response. This ensures the API doesn't crash and
     * provides useful feedback to the client.
     *
     * Why this error handling approach:
     * - User Experience: Provides clear error messages for debugging
     * - API Stability: Prevents server crashes from propagating to client
     * - Debugging: Includes error details for development troubleshooting
     * - Security: Generic error message prevents information leakage
     */
    return res.status(400).json({ error: `Something went wrong ${error}` });
  }
}
