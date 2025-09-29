/**
 * PrismaClient Singleton for DEX Real-Time Streaming Platform
 *
 * This module creates and manages a singleton PrismaClient instance optimized for
 * the streaming platform's database operations. It implements a critical pattern
 * for Next.js applications to prevent connection pool exhaustion during development
 * while maintaining optimal performance in production.
 *
 * Key architectural decisions for the streaming platform:
 * - Singleton Pattern: Ensures only one PrismaClient instance exists across the application
 * - Development Optimization: Prevents multiple connections during Next.js hot reloads
 * - Production Efficiency: Creates new instances per serverless function for optimal scaling
 * - Global Access: Enables database operations from any part of the application
 *
 * The streaming platform relies on this singleton for:
 * - User Authentication: Database operations in auth routes and session management
 * - Content Management: Movie data operations across all API endpoints
 * - User Preferences: Favorites, watchlists, and personalized content features
 * - Performance: Connection pooling and query optimization for high-traffic scenarios
 *
 * @see {@link global.d.ts} Global TypeScript declaration for prismadb
 * @see {@link prisma/schema.prisma} Database schema and model definitions
 * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client} Prisma Client Documentation
 */

import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient Instance with Development Hot Reload Protection
 *
 * This client instance is the heart of the streaming platform's database operations.
 * The implementation uses a sophisticated pattern to handle Next.js development
 * hot reloads while maintaining optimal performance in production.
 *
 * Why this pattern is essential for the streaming platform:
 * - Development Hot Reload: Next.js hot reloads can create multiple PrismaClient
 *   instances, leading to "too many connections" errors with MongoDB Atlas
 * - Connection Pooling: Reusing the same instance optimizes database connection
 *   management and reduces connection overhead
 * - Memory Efficiency: Prevents memory leaks from multiple client instances
 * - Type Safety: Provides full TypeScript intellisense for all database operations
 *
 * Implementation Details:
 * - First checks if global.prismadb exists (from previous hot reloads)
 * - If not, creates a new PrismaClient instance
 * - In development: assigns to global.prismadb for reuse across hot reloads
 * - In production: creates new instance per serverless function (optimal for scaling)
 *
 * Streaming Platform Usage:
 * - API Routes: Powers all /api/* endpoints (auth, movies, favorites, random)
 * - Server-Side Rendering: Enables database access in getServerSideProps
 * - Authentication: Handles user login, registration, and session management
 * - Content Operations: Manages movie catalog, user favorites, and streaming metadata
 *
 * Database Operations Supported:
 * - User Management: findUnique, create, update for user profiles and authentication
 * - Movie Catalog: findMany, findUnique for content browsing and streaming
 * - Favorites System: Array operations on user.favoriteIds for personalized content
 * - Session Management: NextAuth.js integration for OAuth and credentials auth
 *
 * @see {@link pages/api/movies/index.ts} Example usage in movie listing API
 * @see {@link lib/serverAuth.ts} Example usage in authentication middleware
 * @see {@link pages/api/favorites.ts} Example usage in user favorites API
 */
const client = global.prismadb || new PrismaClient();

/**
 * Global Assignment for Development Hot Reload Protection
 *
 * This conditional assignment is crucial for preventing connection pool exhaustion
 * during Next.js development. It ensures that hot reloads don't create multiple
 * PrismaClient instances that would overwhelm the MongoDB connection limit.
 *
 * Why this is needed for the streaming platform:
 * - Development Experience: Prevents "too many connections" errors during development
 * - Resource Management: Reuses existing connections instead of creating new ones
 * - Performance: Maintains connection pooling benefits across hot reloads
 * - Stability: Ensures consistent database access during development iterations
 *
 * Environment-Specific Behavior:
 * - Development (NODE_ENV !== 'production'): Assigns to global.prismadb for reuse
 * - Production (NODE_ENV === 'production'): Skips assignment, creates per-request instances
 *
 * This pattern is essential for streaming platforms because:
 * - High Database Usage: Streaming platforms make frequent database calls for content and user data
 * - Development Iteration: Developers frequently modify code, triggering hot reloads
 * - Connection Limits: MongoDB Atlas has connection limits that must be respected
 * - Performance: Connection reuse improves response times for API endpoints
 *
 * @see {@link https://www.prisma.io/docs/guides/other/troubleshooting-orm/too-many-connections} Prisma Connection Troubleshooting
 * @see {@link https://nextjs.org/docs/advanced-features/fast-refresh} Next.js Fast Refresh Documentation
 */
if (process.env.NODE_ENV !== 'production') global.prismadb = client;

/**
 * Default Export - PrismaClient Singleton Instance
 *
 * This is the main export that provides the PrismaClient instance to the entire
 * streaming platform. It's imported by all API routes and server-side functions
 * that need database access.
 *
 * Usage Pattern:
 * ```typescript
 * import prismadb from '@/lib/prismadb';
 *
 * // In API routes
 * const movies = await prismadb.movie.findMany();
 * const user = await prismadb.user.findUnique({ where: { email } });
 * ```
 *
 * Streaming Platform Integration:
 * - All API routes import this client for database operations
 * - Server-side authentication uses this client for user verification
 * - Content management relies on this client for movie and user data
 * - NextAuth.js adapter uses this client for session and account management
 *
 * Type Safety:
 * - Fully typed with generated Prisma client types
 * - IntelliSense support for all database operations
 * - Compile-time checking for query structure and field names
 * - Automatic type updates when schema changes
 *
 * @see {@link pages/api/movies/index.ts} Movie listing API using this client
 * @see {@link pages/api/favorites.ts} User favorites API using this client
 * @see {@link lib/serverAuth.ts} Authentication middleware using this client
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration using this client
 */
export default client;
