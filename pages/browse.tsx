/**
 * Main Browsing Page for DEX Real-Time Streaming Platform
 *
 * This is the primary streaming interface that provides authenticated users with
 * access to the complete movie catalog, personalized content, and interactive
 * features. It implements a Netflix-like browsing experience with content
 * discovery, user favorites, and seamless navigation throughout the platform.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Gateway: Acts as the main entry point for authenticated users
 * - Content Discovery: Provides comprehensive movie catalog browsing and search
 * - User Personalization: Enables personalized content sections and favorites
 * - Interactive Features: Supports movie details, play buttons, and user interactions
 * - Netflix-Style Design: Familiar UI patterns for streaming platform credibility
 *
 * The streaming platform relies on this page for:
 * - Main User Experience: Primary interface for authenticated streaming access
 * - Content Discovery: Enables users to explore and discover streaming content
 * - Personalization: Provides user-specific content and favorites management
 * - User Engagement: Creates interactive experiences for content consumption
 *
 * @see {@link pages/profiles.tsx} Profile selection page that redirects here
 * @see {@link pages/index.tsx} Landing page that redirects authenticated users here
 * @see {@link pages/auth.tsx} Authentication page for login/register
 * @see {@link components/Navbar.tsx} Navigation component with user controls
 * @see {@link components/Billboard.tsx} Featured content display component
 * @see {@link components/MovieList.tsx} Movie grid display component
 * @see {@link components/InfoModal.tsx} Movie details modal component
 */

import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import InfoModal from '@/components/InfoModal';
import useInfoModal from '@/hooks/useInfoModal';

/**
 * Server-Side Props for Authentication Protection
 *
 * This function handles server-side authentication checking for the main browsing
 * page, ensuring that only authenticated users can access the streaming platform.
 * It redirects unauthenticated users back to the authentication page.
 *
 * Why this server-side protection is essential for the streaming platform:
 * - Content Security: Prevents unauthorized access to streaming content and user data
 * - User Experience: Ensures only authenticated users see the main streaming interface
 * - Authentication Flow: Maintains proper authentication state throughout the platform
 * - Performance: Server-side redirects are faster than client-side authentication checks
 *
 * Authentication Flow:
 * 1. Checks if user has valid session using NextAuth.js getSession
 * 2. If authenticated: Renders main streaming interface with full content access
 * 3. If not authenticated: Redirects to /auth for authentication
 * 4. Uses permanent: false for temporary redirects (better for user experience)
 *
 * Streaming Platform Integration:
 * - Authentication Page: Redirects unauthenticated users to /auth
 * - Main Streaming Interface: Allows authenticated users to access full platform
 * - Content Access: Provides gateway to movie catalog, favorites, and streaming
 * - User Journey: Maintains authentication state throughout the platform
 *
 * @param context - Next.js server-side props context with request/response data
 * @returns Promise<{ props: {} } | { redirect: { destination: string; permanent: boolean } }>
 *
 * @example
 * ```typescript
 * // Authenticated user flow
 * // User completes auth → getServerSideProps checks session → renders browse page
 *
 * // Unauthenticated user flow
 * // User visits /browse → getServerSideProps checks session → redirects to /auth
 * ```
 *
 * @see {@link pages/auth.tsx} Authentication page for login/register
 * @see {@link pages/profiles.tsx} Profile selection page
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 */
export async function getServerSideProps(context: NextPageContext) {
  /**
   * Session Validation
   *
   * Uses NextAuth.js getSession to check if the user has a valid authentication
   * session. This is the core logic that determines whether to show the main
   * streaming interface or redirect to the authentication page.
   *
   * Why this check is crucial for the streaming platform:
   * - Content Security: Prevents unauthorized access to streaming content
   * - User Experience: Ensures only authenticated users see main interface
   * - Authentication Flow: Maintains proper authentication state
   * - Performance: Server-side checks are faster than client-side authentication
   */
  const session = await getSession(context);

  /**
   * Unauthenticated User Redirect
   *
   * If the user doesn't have a valid session, redirects them to the authentication
   * page where they can log in or register. This ensures only authenticated users
   * can access the main streaming platform.
   *
   * Why redirect to /auth for unauthenticated users:
   * - Content Security: Prevents unauthorized access to streaming content
   * - User Experience: Guides users to authentication before platform access
   * - Authentication Flow: Maintains proper authentication state
   * - Business Logic: Only authenticated users should access the full platform
   *
   * Redirect Configuration:
   * - destination: '/auth' - Authentication page for login/register
   * - permanent: false - Temporary redirect for better user experience
   */
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  /**
   * Authenticated User Main Interface
   *
   * Returns empty props to render the main streaming interface for authenticated
   * users. This enables the complete streaming platform experience with content
   * discovery, personalization, and interactive features.
   *
   * Why empty props for authenticated users:
   * - Main Interface: Shows the complete streaming platform for authenticated users
   * - Content Access: Enables full access to movie catalog and streaming features
   * - Personalization: Provides user-specific content and favorites
   * - User Experience: Delivers the main streaming platform experience
   */
  return {
    props: {},
  };
}

/**
 * Main Streaming Interface Component
 *
 * This component renders the complete streaming platform interface for authenticated
 * users, providing content discovery, personalization, and interactive features.
 * It's designed to deliver a Netflix-like browsing experience with comprehensive
 * movie catalog access and user-specific content management.
 *
 * Why this component is essential for the streaming platform:
 * - Main User Experience: Primary interface for authenticated streaming access
 * - Content Discovery: Enables users to explore and discover streaming content
 * - Personalization: Provides user-specific content and favorites management
 * - User Engagement: Creates interactive experiences for content consumption
 *
 * Component Architecture:
 * - InfoModal: Global modal for movie details and interactive features
 * - Navbar: Navigation with user controls, search, and account management
 * - Billboard: Featured content display with video previews and call-to-action
 * - MovieList Components: Grid displays for different content categories
 * - Data Hooks: SWR-powered data fetching for movies, favorites, and user interactions
 *
 * Content Sections:
 * - "Trending Now": Main movie catalog with popular and current content
 * - "My List": User's personalized favorites and saved content
 * - Featured Content: Billboard with highlighted movies and video previews
 * - Interactive Features: Play buttons, favorites, and detailed movie information
 *
 * User Experience Flow:
 * 1. User arrives from authentication or profile selection
 * 2. User sees featured content in billboard with video previews
 * 3. User browses trending movies in responsive grid layout
 * 4. User accesses personalized "My List" with their favorite content
 * 5. User interacts with movies through play buttons and detailed information
 * 6. User can search, filter, and discover new content through navigation
 *
 * @returns JSX.Element - The complete main streaming interface
 *
 * @example
 * ```typescript
 * // User journey example
 * // 1. User completes authentication → redirects to /browse
 * // 2. User sees featured content and movie catalog
 * // 3. User browses trending movies and personal favorites
 * // 4. User interacts with content through play buttons and details
 * // 5. User gains full access to streaming platform features
 * ```
 *
 * @see {@link pages/profiles.tsx} Profile selection page that redirects here
 * @see {@link pages/index.tsx} Landing page that redirects authenticated users here
 * @see {@link components/Navbar.tsx} Navigation component with user controls
 * @see {@link components/Billboard.tsx} Featured content display component
 * @see {@link components/MovieList.tsx} Movie grid display component
 * @see {@link components/InfoModal.tsx} Movie details modal component
 * @see {@link hooks/useMovieList.ts} Movie catalog data hook
 * @see {@link hooks/useFavorites.ts} User favorites data hook
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 */
export default function Home() {
  /**
   * Movie Catalog Data
   *
   * Fetches the complete movie catalog using the useMovieList hook. This provides
   * access to all available streaming content for the "Trending Now" section
   * and enables comprehensive content discovery throughout the platform.
   *
   * Why movie catalog data is essential for the streaming platform:
   * - Content Discovery: Enables users to explore the complete movie catalog
   * - User Experience: Powers the main content browsing interface
   * - Content Access: Provides streaming URLs and metadata for video playback
   * - Platform Value: Delivers the core streaming content to users
   *
   * Data Structure:
   * - Array of movie objects with complete metadata
   * - Streaming URLs for video playback
   * - Thumbnail URLs for UI display
   * - Title, description, genre, and duration information
   * - Defaults to empty array for safe rendering
   */
  const { data: movies = [] } = useMovieList();

  /**
   * User Favorites Data
   *
   * Fetches the user's favorite movies using the useFavorites hook. This provides
   * access to personalized content for the "My List" section and enables
   * user-specific content management throughout the platform.
   *
   * Why user favorites data is important for the streaming platform:
   * - Personalization: Enables personalized content sections like "My List"
   * - User Experience: Provides quick access to user's favorite content
   * - Content Discovery: Helps users rediscover movies they've previously liked
   * - User Engagement: Increases retention through personalized content curation
   *
   * Data Structure:
   * - Array of favorite movie objects with complete metadata
   * - Streaming URLs for video playback
   * - Thumbnail URLs for UI display
   * - All fields from the Movie model in Prisma schema
   * - Defaults to empty array for safe rendering
   */
  const { data: favorites = [] } = useFavorites();

  /**
   * Modal State Management
   *
   * Manages the movie information modal state using the useInfoModal hook. This
   * enables interactive movie details display and user interactions throughout
   * the platform without page navigation.
   *
   * Why modal state management is essential for the streaming platform:
   * - User Experience: Enables detailed movie information without navigation
   * - Interactive Features: Powers play buttons, favorites, and detailed views
   * - Content Discovery: Provides quick access to movie details and actions
   * - Engagement: Creates interactive experiences for content consumption
   *
   * Modal State:
   * - isOpen: Boolean flag indicating whether the modal is currently visible
   * - closeModal: Function to close the modal and clear the movie context
   * - Global state management enables modal control from any component
   */
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}
