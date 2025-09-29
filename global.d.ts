/**
 * Global TypeScript Declaration for DEX Real-Time Streaming Platform
 *
 * This file extends the global TypeScript namespace to include a PrismaClient instance
 * that can be accessed anywhere in the application. This is a critical optimization
 * for the streaming platform's database operations and Next.js development workflow.
 *
 * Key architectural decisions reflected in this declaration:
 * - Global PrismaClient Access: Enables database operations across all API routes and server components
 * - Development Hot Reload Optimization: Prevents multiple PrismaClient instances during development
 * - Type Safety: Provides full TypeScript intellisense and type checking for database operations
 * - Next.js Integration: Works seamlessly with Next.js API routes and server-side rendering
 *
 * The streaming platform relies on this global declaration for:
 * - User Authentication: Accessing user data in auth routes and session management
 * - Movie Data Operations: Fetching, creating, and updating movie information
 * - Favorite Management: Handling user favorites and watchlist functionality
 * - Database Connection Pooling: Optimizing database connections across multiple API calls
 *
 * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client} Prisma Client Documentation
 * @see {@link https://nextjs.org/docs/api-routes/introduction} Next.js API Routes
 * @see {@link https://www.typescriptlang.org/docs/handbook/declaration-files.html} TypeScript Declaration Files
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global Type Declaration for PrismaClient Instance
 *
 * This declaration extends the globalThis namespace to include a prismadb property
 * that holds a PrismaClient instance. This is essential for the streaming platform
 * because:
 *
 * Why we need a global PrismaClient:
 * - Development Hot Reload: In development, Next.js hot reloads can create multiple
 *   PrismaClient instances, leading to connection pool exhaustion and database errors
 * - Connection Pooling: Reusing the same PrismaClient instance across API routes
 *   optimizes database connection management and improves performance
 * - Memory Efficiency: Prevents creating new database connections for every API request
 * - Type Safety: Provides TypeScript intellisense and compile-time checking for all
 *   database operations throughout the application
 *
 * Streaming Platform Usage:
 * - API Routes: Used in all /api/* routes for database operations (auth, movies, favorites)
 * - Server-Side Rendering: Enables database access in getServerSideProps functions
 * - Authentication: Powers user authentication and session management across the platform
 * - Data Fetching: Handles all movie data, user preferences, and streaming metadata
 *
 * Database Schema Context:
 * - User Model: Handles user authentication, profiles, and favorite movie lists
 * - Movie Model: Manages streaming content metadata, thumbnails, and video URLs
 * - Session/Account Models: Supports NextAuth.js integration for OAuth providers
 * - MongoDB Integration: Optimized for MongoDB Atlas with ObjectId field mapping
 *
 * Implementation Details:
 * - The actual PrismaClient instance is created in lib/prismadb.ts
 * - In development: global.prismadb is set to reuse the same instance
 * - In production: A new PrismaClient is created for each serverless function
 * - This pattern prevents "too many connections" errors during development
 *
 * @see {@link lib/prismadb.ts} PrismaClient instantiation and global assignment
 * @see {@link prisma/schema.prisma} Database schema and model definitions
 */
declare global {
  namespace globalThis {
    /**
     * Global PrismaClient Instance
     *
     * This variable holds the shared PrismaClient instance that is used throughout
     * the streaming platform for all database operations. It's assigned in lib/prismadb.ts
     * and provides type-safe access to the database across the entire application.
     *
     * Type: PrismaClient - The generated Prisma client with full type safety
     * Scope: Global - Accessible from any file in the application
     * Lifecycle: Persistent across hot reloads in development, per-request in production
     *
     * Usage Examples:
     * - const user = await global.prismadb.user.findUnique({ where: { email } })
     * - const movies = await global.prismadb.movie.findMany()
     * - const favorites = await global.prismadb.user.update({ data: { favoriteIds } })
     *
     * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client} PrismaClient API Reference
     */
    var prismadb: PrismaClient;
  }
}
