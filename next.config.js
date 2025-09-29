/**
 * Next.js Configuration for DEX Real-Time Streaming Platform
 *
 * This configuration file defines how Next.js builds and serves the streaming application.
 * The current minimal configuration focuses on React development best practices while
 * maintaining compatibility with the streaming platform's performance requirements.
 *
 * Key architectural decisions reflected in this config:
 * - Optimized for Next.js 13.5.11 Pages Router (not App Router)
 * - Supports both client-side and server-side rendering for optimal performance
 * - Configured for production deployment on Vercel
 * - Enables React development best practices for a complex streaming UI
 *
 * @see {@link https://nextjs.org/docs/api-reference/next.config.js/introduction} Next.js Configuration Documentation
 * @see {@link https://vercel.com/docs/concepts/projects/project-configuration} Vercel Deployment Configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * React Strict Mode
   *
   * Enables React's Strict Mode, which helps identify potential problems in the application
   * by intentionally double-invoking functions that should be side-effect free. This is
   * particularly important for a streaming platform because:
   *
   * Why it's crucial for this streaming app:
   * - **Component Lifecycle Safety**: Ensures components handle mounting/unmounting correctly,
   *   which is critical for video players and real-time UI updates
   * - **State Management Reliability**: Helps catch bugs in SWR data fetching and Zustand
   *   state management that could cause UI inconsistencies
   * - **Memory Leak Prevention**: Identifies potential memory leaks in video components and
   *   event listeners that could degrade performance over time
   * - **Development Quality**: Catches issues early that could affect user experience in
   *   production, especially important for a streaming service where users expect smooth
   *   performance
   *
   * In production, this helps ensure the streaming platform remains stable and performant
   * even with complex state management and real-time updates.
   *
   * @see {@link https://reactjs.org/docs/strict-mode.html} React Strict Mode Documentation
   */
  reactStrictMode: true,
};

/**
 * Export Configuration
 *
 * Exports the Next.js configuration object using CommonJS syntax. This is the standard
 * approach for Next.js configuration files and ensures compatibility with:
 * - Next.js build system
 * - Vercel deployment platform
 * - Node.js runtime environment
 *
 * The configuration will be automatically picked up by Next.js during:
 * - Development server startup (`npm run dev`)
 * - Production build process (`npm run build`)
 * - Production server startup (`npm run start`)
 * - Vercel deployment and build processes
 */
module.exports = nextConfig;
