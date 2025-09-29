/**
 * NextAuth.js Configuration for DEX Real-Time Streaming Platform
 *
 * This module configures NextAuth.js for multi-provider authentication in the streaming
 * platform, supporting OAuth providers (GitHub, Google) and traditional email/password
 * authentication. It's the central authentication hub that powers user login, session
 * management, and security across the entire platform.
 *
 * Key architectural decisions for the streaming platform:
 * - Multi-Provider Support: Enables OAuth (GitHub, Google) and credentials authentication
 * - Database Integration: Uses Prisma adapter for seamless database session management
 * - JWT Strategy: Implements JWT-based sessions for optimal performance and scalability
 * - Security Focus: Includes bcrypt password hashing and secure credential validation
 *
 * The streaming platform relies on this configuration for:
 * - User Authentication: Powers login flows across all authentication methods
 * - Session Management: Handles user sessions and authentication state
 * - API Security: Provides authentication context for protected API routes
 * - User Experience: Enables seamless login with multiple provider options
 *
 * @see {@link lib/serverAuth.ts} Server-side authentication middleware using this config
 * @see {@link pages/auth.tsx} Authentication UI components using this config
 * @see {@link pages/_app.tsx} SessionProvider integration
 * @see {@link https://next-auth.js.org/} NextAuth.js Documentation
 */

import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from '@/lib/prismadb';

/**
 * NextAuth.js Configuration Object
 *
 * This configuration object defines how NextAuth.js handles authentication for the
 * streaming platform. It supports multiple authentication providers and integrates
 * with the platform's database for session and user management.
 *
 * Why this configuration is essential for the streaming platform:
 * - User Convenience: Provides multiple login options (OAuth + credentials)
 * - Security: Implements secure password hashing and JWT token management
 * - Database Integration: Seamlessly stores sessions and user data in MongoDB
 * - Scalability: JWT strategy enables stateless authentication for serverless deployment
 *
 * Authentication Flow:
 * 1. User selects authentication method (GitHub, Google, or email/password)
 * 2. NextAuth.js handles OAuth flow or credentials validation
 * 3. User data is stored/retrieved from MongoDB via Prisma adapter
 * 4. JWT session is created and managed for subsequent requests
 * 5. Session data is available throughout the application
 *
 * Streaming Platform Integration:
 * - Frontend: Used by auth.tsx for login/register UI components
 * - Backend: Used by serverAuth.ts for API route authentication
 * - Database: Integrates with Prisma schema for user and session management
 * - Security: Provides secure authentication for all protected content
 *
 * @see {@link https://next-auth.js.org/configuration/options} NextAuth.js Configuration Options
 * @see {@link https://next-auth.js.org/adapters/prisma} Prisma Adapter Documentation
 */
export const authOptions: NextAuthOptions = {
  /**
   * Authentication Providers Configuration
   *
   * Defines the available authentication methods for the streaming platform.
   * This array includes OAuth providers and credentials-based authentication
   * to provide users with flexible login options.
   *
   * Provider Types:
   * - OAuth Providers: GitHub and Google for social login
   * - Credentials Provider: Email/password authentication with bcrypt hashing
   *
   * Why multiple providers for streaming platforms:
   * - User Convenience: Reduces friction for user registration and login
   * - Social Integration: Leverages existing social media accounts
   * - Fallback Option: Credentials provider for users who prefer email/password
   * - Security: OAuth providers handle security best practices automatically
   */
  providers: [
    /**
     * GitHub OAuth Provider
     *
     * Enables users to authenticate using their GitHub accounts. This is popular
     * among developers and technical users who frequent streaming platforms.
     *
     * Configuration:
     * - clientId: GitHub OAuth app client ID from environment variables
     * - clientSecret: GitHub OAuth app client secret from environment variables
     *
     * Why GitHub for streaming platforms:
     * - Developer Audience: Many streaming platform users are developers
     * - Trust Factor: GitHub is widely trusted for authentication
     * - Profile Data: Provides username and profile information automatically
     * - Security: GitHub handles OAuth security best practices
     */
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    /**
     * Google OAuth Provider
     *
     * Enables users to authenticate using their Google accounts. This is the
     * most widely used OAuth provider and provides excellent user experience.
     *
     * Configuration:
     * - clientId: Google OAuth app client ID from environment variables
     * - clientSecret: Google OAuth app client secret from environment variables
     *
     * Why Google for streaming platforms:
     * - Mass Adoption: Most users have Google accounts
     * - User Experience: Seamless one-click authentication
     * - Profile Data: Provides name, email, and profile picture
     * - Security: Google's robust security infrastructure
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    /**
     * Credentials Authentication Provider
     *
     * Enables traditional email/password authentication with secure password
     * hashing using bcrypt. This provides a fallback option for users who
     * prefer not to use OAuth providers.
     *
     * Configuration:
     * - id: Unique identifier for the credentials provider
     * - name: Display name for the authentication method
     * - credentials: Form fields for email and password input
     * - authorize: Custom function for credential validation
     *
     * Why credentials authentication for streaming platforms:
     * - User Preference: Some users prefer email/password over OAuth
     * - Privacy: Users may not want to link social media accounts
     * - Control: Platform has full control over authentication flow
     * - Fallback: Provides authentication when OAuth providers are unavailable
     */
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      /**
       * Credentials Authorization Function
       *
       * This function validates user credentials during login attempts. It performs
       * secure password verification using bcrypt and ensures user accounts exist
       * in the database before allowing authentication.
       *
       * Authentication Flow:
       * 1. Validates that both email and password are provided
       * 2. Queries database to find user by email address
       * 3. Verifies user exists and has a hashed password
       * 4. Compares provided password with stored bcrypt hash
       * 5. Returns user object if authentication succeeds
       *
       * Security Features:
       * - Input Validation: Ensures required credentials are provided
       * - Database Verification: Confirms user account exists
       * - Password Hashing: Uses bcrypt for secure password comparison
       * - Error Handling: Provides clear error messages for different failure scenarios
       *
       * Why this approach for streaming platforms:
       * - Security: bcrypt provides industry-standard password hashing
       * - User Experience: Clear error messages help users understand login issues
       * - Data Integrity: Verifies user account exists before authentication
       * - Performance: Efficient database queries for authentication
       *
       * @param credentials - Object containing email and password from login form
       * @returns Promise<User | null> - User object if authentication succeeds, null otherwise
       * @throws Error - Various error messages for different authentication failures
       */
      async authorize(credentials) {
        /**
         * Input Validation
         *
         * Ensures both email and password are provided before attempting authentication.
         * This prevents unnecessary database queries and provides clear error feedback.
         */
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        /**
         * Database User Lookup
         *
         * Queries the database to find the user by email address. This is the first
         * step in credential validation and ensures the user account exists.
         */
        const user = await prismadb.user.findUnique({
          where: { email: credentials.email },
        });

        /**
         * User Existence Validation
         *
         * Verifies that the user exists and has a hashed password. This prevents
         * authentication attempts with non-existent accounts or OAuth-only accounts.
         */
        if (!user || !user.hashedPassword) {
          throw new Error('Email does not exist');
        }

        /**
         * Password Verification
         *
         * Uses bcrypt to securely compare the provided password with the stored
         * hash. This is the core security mechanism for credentials authentication.
         */
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        /**
         * Authentication Result
         *
         * Returns the user object if password verification succeeds, or throws
         * an error if the password is incorrect.
         */
        if (!isCorrectPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],

  /**
   * Custom Pages Configuration
   *
   * Defines custom pages for the authentication flow. This allows the streaming
   * platform to use its own branded authentication UI instead of NextAuth.js defaults.
   *
   * Why custom pages for streaming platforms:
   * - Brand Consistency: Maintains platform's visual identity
   * - User Experience: Provides familiar interface for users
   * - Customization: Allows platform-specific features and styling
   * - Integration: Seamlessly integrates with platform's design system
   */
  pages: {
    signIn: '/auth',
  },

  /**
   * Development Debug Configuration
   *
   * Enables debug logging in development mode to help with authentication
   * troubleshooting and development workflow.
   *
   * Why debug mode for streaming platforms:
   * - Development: Helps developers understand authentication flow
   * - Troubleshooting: Provides detailed logs for debugging issues
   * - Security: Disabled in production to prevent information leakage
   * - Performance: Only enabled when needed to avoid performance impact
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * Prisma Database Adapter
   *
   * Integrates NextAuth.js with the platform's Prisma database setup for
   * session and user management. This enables seamless database operations
   * for authentication data.
   *
   * Why Prisma adapter for streaming platforms:
   * - Database Integration: Seamlessly works with existing Prisma setup
   * - Type Safety: Provides full TypeScript support for database operations
   * - Performance: Optimized database queries for authentication
   * - Consistency: Uses same database client as rest of the platform
   */
  adapter: PrismaAdapter(prismadb),

  /**
   * Session Strategy Configuration
   *
   * Configures NextAuth.js to use JWT (JSON Web Token) strategy for session
   * management. This is optimal for serverless deployments and provides
   * stateless authentication.
   *
   * Why JWT strategy for streaming platforms:
   * - Serverless: Works well with Vercel and other serverless platforms
   * - Performance: No database queries required for session validation
   * - Scalability: Stateless authentication scales horizontally
   * - Security: JWT tokens are cryptographically signed and secure
   */
  session: {
    strategy: 'jwt',
  },

  /**
   * JWT Configuration
   *
   * Configures JWT token settings including the secret key for signing tokens.
   * This ensures JWT tokens are secure and cannot be tampered with.
   *
   * Why JWT configuration for streaming platforms:
   * - Security: Secret key ensures tokens cannot be forged
   * - Environment: Uses environment variables for secure secret management
   * - Validation: Enables secure token validation across the platform
   * - Consistency: Same secret used for all JWT operations
   */
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },

  /**
   * NextAuth.js Secret
   *
   * Main secret key for NextAuth.js operations including encryption and
   * token signing. This is essential for the security of the authentication system.
   *
   * Why this secret is crucial for streaming platforms:
   * - Security: Used for encrypting sensitive data and signing tokens
   * - Environment: Stored securely in environment variables
   * - Production: Must be unique and secure in production environments
   * - Encryption: Protects session data and authentication tokens
   */
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * NextAuth.js Handler Export
 *
 * This is the main NextAuth.js handler that processes all authentication
 * requests for the streaming platform. It's automatically called by Next.js
 * for all requests to /api/auth/* endpoints.
 *
 * API Endpoints Created:
 * - /api/auth/signin - Login page and OAuth provider redirects
 * - /api/auth/signout - User logout functionality
 * - /api/auth/callback/[provider] - OAuth provider callbacks
 * - /api/auth/session - Current session information
 * - /api/auth/csrf - CSRF token for security
 *
 * Streaming Platform Integration:
 * - Frontend: Used by auth.tsx for login/register functionality
 * - Backend: Used by serverAuth.ts for session validation
 * - Database: Integrates with Prisma for user and session storage
 * - Security: Provides secure authentication for all protected content
 *
 * @see {@link pages/auth.tsx} Authentication UI using this handler
 * @see {@link lib/serverAuth.ts} Server-side authentication using this handler
 * @see {@link https://next-auth.js.org/getting-started/example} NextAuth.js Examples
 */
export default NextAuth(authOptions);
