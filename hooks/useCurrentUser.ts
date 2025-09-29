/**
 * Current User Authentication Hook for DEX Real-Time Streaming Platform
 *
 * This custom React hook provides access to the current authenticated user's
 * data throughout the streaming platform. It's a critical hook that enables
 * personalized user experiences, authentication state management, and
 * user-specific functionality across all components.
 *
 * Key architectural decisions for the streaming platform:
 * - SWR Integration: Uses SWR for efficient data fetching, caching, and real-time updates
 * - Authentication Context: Provides user data for personalization and protected features
 * - Real-time Updates: Enables immediate UI updates when user data changes
 * - Error Handling: Provides loading states and error handling for authentication failures
 *
 * The streaming platform relies on this hook for:
 * - User Profile Display: Shows user information in AccountMenu and profile components
 * - Personalization: Enables user-specific features like favorites and recommendations
 * - Authentication State: Provides current user context for protected components
 * - UI Customization: Allows personalized experiences based on user data
 *
 * @see {@link pages/api/current.ts} Current user API endpoint
 * @see {@link components/AccountMenu.tsx} User profile display component
 * @see {@link pages/profiles.tsx} User profile management page
 * @see {@link components/FavoriteButton.tsx} User-specific favorite functionality
 * @see {@link lib/fetcher.ts} SWR data fetcher function
 */

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

/**
 * Current User Data Hook
 *
 * This hook fetches and manages the current authenticated user's data using
 * SWR for efficient caching and real-time updates. It's the primary way
 * components access user information for personalization and authentication
 * state management.
 *
 * Why this hook is essential for the streaming platform:
 * - User Experience: Enables personalized content and UI based on user data
 * - Authentication State: Provides real-time user authentication status
 * - Personalization: Powers user-specific features like favorites and watchlists
 * - Component Context: Supplies user data to React components throughout the app
 *
 * SWR Benefits for User Data:
 * - Caching: Automatically caches user data to reduce API calls
 * - Revalidation: Intelligently updates user data in the background
 * - Loading States: Provides loading indicators during data fetching
 * - Error States: Handles authentication failures gracefully
 * - Optimistic Updates: Supports immediate UI updates with background sync
 *
 * User Data Provided:
 * - Profile Information: name, email, image for UI display
 * - Authentication Data: favoriteIds for personalized content
 * - Account Metadata: createdAt, updatedAt for user management
 * - Preferences: User-specific settings and personalized content lists
 *
 * Streaming Platform Integration:
 * - AccountMenu: Displays user name and profile information
 * - FavoriteButton: Uses favoriteIds to determine favorite state
 * - Profiles Page: Shows user name for profile selection
 * - Personalization: Enables user-specific content recommendations
 *
 * @returns {Object} Hook return object with user data and SWR state
 * @returns {Object} data - Current user data from /api/current endpoint
 * @returns {Error} error - Authentication or network error if any
 * @returns {boolean} isLoading - Loading state during data fetching
 * @returns {Function} mutate - Function to manually revalidate user data
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * const { data: user, error, isLoading } = useCurrentUser();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Authentication error</div>;
 *
 * return <div>Welcome, {user?.name}!</div>;
 * ```
 *
 * @example
 * ```typescript
 * // Usage with mutate for optimistic updates
 * const { data: currentUser, mutate } = useCurrentUser();
 *
 * const updateUser = async (newData) => {
 *   // Optimistic update
 *   mutate({ ...currentUser, ...newData }, false);
 *
 *   // API call
 *   await updateUserAPI(newData);
 *
 *   // Revalidate
 *   mutate();
 * };
 * ```
 *
 * @see {@link pages/api/current.ts} Current user API endpoint
 * @see {@link components/AccountMenu.tsx} User profile display
 * @see {@link components/FavoriteButton.tsx} Favorite management
 * @see {@link pages/profiles.tsx} Profile selection page
 */
const useCurrentUser = () => {
  /**
   * SWR Data Fetching Configuration
   *
   * Uses SWR to fetch user data from the /api/current endpoint with the
   * platform's standardized fetcher function. This configuration provides
   * efficient caching, background updates, and error handling for user data.
   *
   * Why SWR for user data:
   * - Performance: Caches user data to reduce redundant API calls
   * - Real-time Updates: Automatically revalidates data when needed
   * - Loading States: Provides loading indicators during authentication
   * - Error Handling: Gracefully handles authentication failures
   * - Optimistic Updates: Supports immediate UI updates with background sync
   *
   * Fetcher Integration:
   * - Uses the platform's standardized fetcher function
   * - Handles HTTP errors and network issues automatically
   * - Provides consistent data extraction for all API calls
   * - Enables SWR's caching and revalidation features
   */
  const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

  /**
   * Hook Return Object
   *
   * Returns the user data and SWR state in a clean, consistent interface
   * that components can easily consume for user context and authentication
   * state management.
   *
   * Return Object Structure:
   * - data: Current user object with profile, authentication, and preference data
   * - error: Authentication or network error if user data fetch fails
   * - isLoading: Boolean indicating if user data is currently being fetched
   * - mutate: Function to manually revalidate user data for optimistic updates
   *
   * Why this return structure:
   * - Consistency: Matches SWR's standard return pattern
   * - Flexibility: Provides all necessary data for different use cases
   * - Performance: Enables components to optimize rendering based on state
   * - User Experience: Supports loading states and error handling
   */
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Default Export - Current User Hook
 *
 * This is the main export that provides the useCurrentUser hook to all
 * components in the streaming platform that need access to user data
 * for personalization and authentication state management.
 *
 * Usage Pattern:
 * ```typescript
 * import useCurrentUser from '@/hooks/useCurrentUser';
 *
 * // In React components
 * const { data: user, error, isLoading } = useCurrentUser();
 * ```
 *
 * Streaming Platform Integration:
 * - All user-facing components use this hook for user context
 * - Enables personalized experiences throughout the platform
 * - Provides authentication state for protected features
 * - Supports real-time updates and optimistic UI changes
 *
 * @see {@link pages/api/current.ts} Current user API endpoint
 * @see {@link components/AccountMenu.tsx} User profile display
 * @see {@link components/FavoriteButton.tsx} Favorite management
 * @see {@link pages/profiles.tsx} Profile selection page
 */
export default useCurrentUser;
