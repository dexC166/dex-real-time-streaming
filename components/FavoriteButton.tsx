/**
 * Favorite Toggle Button Component for DEX Real-Time Streaming Platform
 *
 * This is an interactive button component that allows users to add and remove
 * movies from their favorites list. It implements real-time state management,
 * optimistic updates, and seamless integration with the platform's personalization
 * system. The component provides immediate visual feedback and maintains data
 * consistency across all parts of the streaming platform.
 *
 * Key architectural decisions for the streaming platform:
 * - Real-time Updates: Uses SWR mutate functions for immediate UI updates
 * - Optimistic Updates: Updates UI immediately while API calls complete in background
 * - Dual State Management: Manages both user data and favorites data for consistency
 * - Visual Feedback: Dynamic icons and hover effects for clear user interaction
 * - Netflix-Style Design: Familiar favorite button patterns for streaming platform credibility
 *
 * The streaming platform relies on this component for:
 * - User Personalization: Enables users to curate their personal content collections
 * - Real-time Interaction: Provides immediate feedback for favorite actions
 * - Data Consistency: Ensures favorite state is synchronized across all components
 * - User Experience: Creates engaging personalization features throughout the platform
 *
 * @see {@link components/MovieCard.tsx} Movie card component using this button
 * @see {@link hooks/useCurrentUser.ts} User data hook for favorite state
 * @see {@link hooks/useFavorites.ts} Favorites data hook for real-time updates
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove API endpoint
 * @see {@link pages/browse.tsx} Main browsing page with favorites integration
 */

import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';

/**
 * Favorite Button Props Interface
 *
 * Defines the TypeScript interface for the FavoriteButton component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all movie display contexts in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all favorite buttons receive proper movie ID
 * - API Contract: Provides clear interface for component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes favorite button data structure across the platform
 *
 * @interface FavoriteButtonProps
 * @property {string} movieId - Unique identifier for the movie to manage as favorite
 */
interface FavoriteButtonProps {
  /** Unique identifier for the movie to manage as favorite */
  movieId: string;
}

/**
 * Favorite Toggle Button Component
 *
 * This component renders an interactive button that allows users to add and remove
 * movies from their favorites list. It provides real-time state management,
 * optimistic updates, and seamless integration with the platform's personalization
 * system for a smooth user experience.
 *
 * Why this component is essential for the streaming platform:
 * - User Personalization: Enables users to curate their personal content collections
 * - Real-time Interaction: Provides immediate feedback for favorite actions
 * - Data Consistency: Ensures favorite state is synchronized across all components
 * - User Experience: Creates engaging personalization features throughout the platform
 *
 * Component Features:
 * - Dynamic Icons: Plus icon for adding, check icon for removing favorites
 * - Real-time Updates: Immediate UI updates with background API synchronization
 * - Optimistic Updates: Updates UI before API calls complete for better UX
 * - Visual Feedback: Hover effects and smooth transitions for user interaction
 * - Netflix-Style Design: Familiar favorite button patterns for platform credibility
 *
 * State Management Strategy:
 * - User Data: Uses useCurrentUser hook for favoriteIds array and user context
 * - Favorites Data: Uses useFavorites hook for real-time favorites list updates
 * - Optimistic Updates: Updates both user and favorites data immediately
 * - API Synchronization: Background API calls ensure data consistency
 *
 * User Experience Flow:
 * 1. User sees favorite button with current state (plus or check icon)
 * 2. User clicks button to toggle favorite status
 * 3. UI updates immediately with new icon and visual feedback
 * 4. Background API call synchronizes changes with server
 * 5. All components using favorites data update automatically
 * 6. User experiences seamless personalization across the platform
 *
 * @param props - Component props containing the movie identification
 * @param props.movieId - Unique identifier for the movie to manage as favorite
 * @returns JSX.Element - The rendered interactive favorite toggle button
 *
 * @example
 * ```typescript
 * // Basic usage in movie card
 * const movie = { id: '123', title: 'Movie Title' };
 *
 * return (
 *   <div>
 *     <img src={movie.thumbnailUrl} alt={movie.title} />
 *     <FavoriteButton movieId={movie.id} />
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in movie grid
 * {movies.map(movie => (
 *   <MovieCard key={movie.id} data={movie}>
 *     <FavoriteButton movieId={movie.id} />
 *   </MovieCard>
 * ))}
 * ```
 *
 * @see {@link components/MovieCard.tsx} Movie card component using this button
 * @see {@link hooks/useCurrentUser.ts} User data hook for favorite state
 * @see {@link hooks/useFavorites.ts} Favorites data hook for real-time updates
 * @see {@link pages/api/favorite.ts} Individual favorite add/remove API endpoint
 * @see {@link pages/browse.tsx} Main browsing page with favorites integration
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  /**
   * Favorites Data Management
   *
   * Accesses the mutate function from the useFavorites hook to enable
   * real-time updates of the favorites list. This ensures that when a
   * movie is added or removed from favorites, all components displaying
   * favorites data are updated immediately.
   *
   * Why favorites data management is crucial for the streaming platform:
   * - Real-time Updates: Enables immediate updates to favorites lists across the platform
   * - Data Consistency: Ensures all components show the same favorite state
   * - User Experience: Provides seamless personalization without page refreshes
   * - Platform Integration: Connects favorite actions to the broader personalization system
   */
  const { mutate: mutateFavorites } = useFavorites();

  /**
   * User Data Management
   *
   * Accesses the current user data and mutate function from the useCurrentUser hook.
   * This provides access to the user's favoriteIds array and enables optimistic
   * updates to the user's favorite state for immediate UI feedback.
   *
   * Why user data management is essential for the streaming platform:
   * - User Context: Provides user-specific data for personalization features
   * - Optimistic Updates: Enables immediate UI updates before API calls complete
   * - Data Consistency: Ensures user data is synchronized across all components
   * - Authentication: Maintains user context for personalized experiences
   */
  const { data: currentUser, mutate } = useCurrentUser();

  /**
   * Favorite Status Calculation
   *
   * Determines whether the current movie is in the user's favorites list by
   * checking if the movieId exists in the user's favoriteIds array. This
   * calculation is memoized for performance optimization and provides the
   * basis for the button's visual state and behavior.
   *
   * Why this calculation is crucial for the streaming platform:
   * - Visual State: Determines which icon to display (plus or check)
   * - User Experience: Provides clear indication of current favorite status
   * - Performance: Memoized calculation prevents unnecessary re-computations
   * - Data Consistency: Ensures button state matches user's actual favorites
   *
   * Implementation Details:
   * - Uses useMemo for performance optimization
   * - Depends on currentUser and movieId for proper memoization
   * - Handles undefined currentUser gracefully with fallback to empty array
   * - Returns boolean indicating favorite status for UI rendering
   */
  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(movieId);
  }, [currentUser, movieId]);

  /**
   * Favorite Toggle Handler
   *
   * Handles the favorite toggle action by making the appropriate API call
   * and updating both user data and favorites data for immediate UI feedback.
   * This function implements optimistic updates for a smooth user experience.
   *
   * Why this handler is essential for the streaming platform:
   * - User Interaction: Enables users to manage their personal content collections
   * - Real-time Updates: Provides immediate feedback for favorite actions
   * - Data Consistency: Ensures favorite state is synchronized across all components
   * - User Experience: Creates engaging personalization features
   *
   * Optimistic Update Strategy:
   * 1. Makes API call to add or remove favorite
   * 2. Updates user data immediately with new favoriteIds
   * 3. Triggers favorites data revalidation for real-time updates
   * 4. Provides immediate UI feedback while background sync completes
   *
   * API Integration:
   * - POST /api/favorite: Adds movie to user's favorites list
   * - DELETE /api/favorite: Removes movie from user's favorites list
   * - Both endpoints return updated user data for immediate UI updates
   * - Error handling ensures graceful degradation if API calls fail
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Depends on movieId, isFavorite, currentUser, mutate, and mutateFavorites
   * - Handles both add and remove operations based on current favorite status
   * - Updates both user data and favorites data for complete synchronization
   */
  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      response = await axios.delete('/api/favorite', { data: { movieId } });
    } else {
      response = await axios.post('/api/favorite', { movieId });
    }

    const updatedFavoriteIds = response?.data?.favoriteIds;

    mutate({
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });

    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  /**
   * Dynamic Icon Selection
   *
   * Selects the appropriate icon based on the current favorite status.
   * This provides clear visual feedback to users about the current state
   * and the action that will be performed when they click the button.
   *
   * Why dynamic icon selection is important for the streaming platform:
   * - Visual Feedback: Provides clear indication of current favorite status
   * - User Experience: Helps users understand what action the button will perform
   * - Intuitive Design: Uses familiar icons (plus for add, check for remove)
   * - Accessibility: Visual cues help users understand the interface
   *
   * Icon States:
   * - AiOutlinePlus: Displayed when movie is not in favorites (add action)
   * - AiOutlineCheck: Displayed when movie is in favorites (remove action)
   * - Dynamic switching based on isFavorite state
   * - Consistent with Netflix-style favorite button patterns
   */
  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div
      onClick={toggleFavorites}
      className="
  cursor-pointer
  group/item
  w-6
  h-6
  lg:w-10
  lg:h-10
  border-white
  border-2
  rounded-full
  flex
  justify-center
  items-center
  transition
  hover:border-neutral-300
  "
    >
      <Icon className="text-white" size={25} />
    </div>
  );
};

export default FavoriteButton;
