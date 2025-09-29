/**
 * Next.js App Component for DEX Real-Time Streaming Platform
 *
 * This is the root App component that wraps the entire streaming platform
 * with essential providers and global configurations. It serves as the
 * foundation for authentication, session management, and global styling
 * across all pages and components in the platform.
 *
 * Key architectural decisions for the streaming platform:
 * - SessionProvider Integration: Enables NextAuth.js authentication throughout the app
 * - Global Styling: Imports Tailwind CSS and custom styles for consistent UI
 * - Authentication Context: Provides session data to all components and pages
 * - Next.js Integration: Leverages Next.js App component pattern for optimal performance
 *
 * The streaming platform relies on this component for:
 * - User Authentication: Powers login/logout functionality across all pages
 * - Session Management: Provides user session context to all components
 * - Protected Routes: Enables authentication checks in getServerSideProps
 * - User Experience: Ensures seamless authentication state across page navigation
 *
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 * @see {@link lib/serverAuth.ts} Server-side authentication middleware
 * @see {@link pages/index.tsx} Landing page with session-based redirects
 * @see {@link pages/profiles.tsx} Protected profiles page
 * @see {@link pages/browse.tsx} Main browsing page with authentication
 * @see {@link https://next-auth.js.org/getting-started/example} NextAuth.js Documentation
 */

import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';

/**
 * Root App Component
 *
 * This component serves as the root of the streaming platform's React tree,
 * providing essential context and providers to all pages and components.
 * It's the central hub that enables authentication, session management,
 * and global styling across the entire application.
 *
 * Why this component is essential for the streaming platform:
 * - Authentication Foundation: Provides NextAuth.js session context to all components
 * - Global State Management: Enables session access in any component via useSession
 * - Protected Route Support: Powers authentication checks in getServerSideProps
 * - User Experience: Ensures consistent authentication state across page navigation
 * - Performance: Leverages Next.js App component pattern for optimal rendering
 *
 * Component Structure:
 * - SessionProvider: Wraps all components with NextAuth.js session context
 * - Component: Renders the current page component based on routing
 * - pageProps: Passes page-specific props including session data
 *
 * Authentication Flow:
 * 1. NextAuth.js handles authentication via /api/auth/* endpoints
 * 2. Session data is passed to this component via pageProps
 * 3. SessionProvider makes session available to all child components
 * 4. Components can access session via useSession hook or getSession
 * 5. Pages can check authentication in getServerSideProps for protected routes
 *
 * Streaming Platform Integration:
 * - Landing Page: Redirects authenticated users to browse page
 * - Browse Page: Requires authentication for content access
 * - Profiles Page: Protected route that requires user authentication
 * - API Routes: Use serverAuth middleware for session validation
 * - Components: Access user data via useCurrentUser hook
 *
 * @param Component - The current page component being rendered by Next.js
 * @param pageProps - Props for the current page, including session data
 * @param pageProps.session - NextAuth.js session object with user authentication data
 * @param pageProps...pageProps - Additional page-specific props
 *
 * @returns JSX.Element - The wrapped application with SessionProvider context
 *
 * @example
 * ```typescript
 * // In a page component
 * import { useSession } from 'next-auth/react';
 *
 * export default function MyPage() {
 *   const { data: session, status } = useSession();
 *
 *   if (status === 'loading') return <div>Loading...</div>;
 *   if (!session) return <div>Please sign in</div>;
 *
 *   return <div>Welcome {session.user?.name}!</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In getServerSideProps for protected routes
 * import { getSession } from 'next-auth/react';
 *
 * export async function getServerSideProps(context) {
 *   const session = await getSession(context);
 *
 *   if (!session) {
 *     return {
 *       redirect: {
 *         destination: '/auth',
 *         permanent: false,
 *       },
 *     };
 *   }
 *
 *   return { props: {} };
 * }
 * ```
 *
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 * @see {@link lib/serverAuth.ts} Server-side authentication middleware
 * @see {@link pages/index.tsx} Landing page with session-based redirects
 * @see {@link pages/profiles.tsx} Protected profiles page
 * @see {@link pages/browse.tsx} Main browsing page with authentication
 * @see {@link https://next-auth.js.org/getting-started/example} NextAuth.js Documentation
 */
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  /**
   * SessionProvider Wrapper
   *
   * Wraps the entire application with NextAuth.js SessionProvider to enable
   * authentication context throughout the streaming platform. This provider
   * makes session data available to all components and pages, enabling
   * authentication checks, user data access, and protected route functionality.
   *
   * Why SessionProvider is essential for the streaming platform:
   * - Global Authentication: Makes session data available to all components
   * - Real-time Updates: Automatically updates when user logs in/out
   * - Hook Integration: Enables useSession hook in any component
   * - Server-Side Support: Works with getSession in getServerSideProps
   * - Performance: Optimized re-renders only when session changes
   *
   * Session Data Provided:
   * - User Information: name, email, image from authentication providers
   * - Authentication State: loading, authenticated, unauthenticated
   * - Provider Data: OAuth provider information (GitHub, Google)
   * - Session Metadata: expiration, refresh tokens, and security data
   *
   * Streaming Platform Usage:
   * - Components: Access user data via useSession hook for personalization
   * - Pages: Check authentication status for protected content access
   * - API Routes: Validate sessions using serverAuth middleware
   * - Navigation: Redirect users based on authentication state
   * - User Experience: Provide personalized content and features
   *
   * @param session - NextAuth.js session object with user authentication data
   * @param Component - The current page component being rendered
   * @param pageProps - Additional props for the current page component
   */
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
