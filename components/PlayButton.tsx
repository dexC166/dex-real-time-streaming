/**
 * Play Button Component for DEX Real-Time Streaming Platform
 *
 * This is a reusable play button component that provides immediate navigation
 * to the video streaming page for any movie. It implements a Netflix-like
 * play button experience with responsive design, smooth transitions, and
 * seamless integration with the platform's content discovery and streaming system.
 *
 * Key architectural decisions for the streaming platform:
 * - Direct Navigation: Immediate routing to /watch/[movieId] for video streaming
 * - Responsive Design: Adapts button size and text for different screen sizes
 * - Visual Feedback: Hover effects and smooth transitions for user interaction
 * - Netflix-Style Design: Familiar play button patterns for streaming platform credibility
 * - Reusable Component: Single component for all play button instances across the platform
 *
 * The streaming platform relies on this component for:
 * - Video Streaming: Primary entry point to full-screen video playback
 * - Content Discovery: Enables immediate access to streaming content from any context
 * - User Experience: Provides consistent play button behavior across all components
 * - Navigation: Seamless flow from content discovery to video streaming
 *
 * @see {@link pages/watch/[movieId].tsx} Video streaming page that this button navigates to
 * @see {@link components/Billboard.tsx} Featured content with play button
 * @see {@link components/InfoModal.tsx} Movie details modal with play button
 * @see {@link components/MovieCard.tsx} Movie card with play button integration
 * @see {@link pages/browse.tsx} Main browsing page with play button usage
 */

import React from 'react';
import { BsFillPlayFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

/**
 * Play Button Props Interface
 *
 * Defines the TypeScript interface for the PlayButton component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all play button instances in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all play buttons receive proper movie ID
 * - API Contract: Provides clear interface for component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes play button data structure across the platform
 *
 * @interface PlayButtonProps
 * @property {string} movieId - Unique identifier for the movie to stream
 */
interface PlayButtonProps {
  /** Unique identifier for the movie to stream */
  movieId: string;
}

/**
 * Play Button Component
 *
 * This component renders an interactive play button that navigates users
 * to the video streaming page for the specified movie. It's designed to
 * provide a consistent, Netflix-like play button experience across all
 * contexts in the streaming platform.
 *
 * Why this component is essential for the streaming platform:
 * - Video Streaming: Primary entry point to full-screen video playback
 * - Content Discovery: Enables immediate access to streaming content from any context
 * - User Experience: Provides consistent play button behavior across all components
 * - Navigation: Seamless flow from content discovery to video streaming
 *
 * Component Features:
 * - Direct Navigation: Immediate routing to /watch/[movieId] for video streaming
 * - Responsive Design: Adapts button size and text for different screen sizes
 * - Visual Feedback: Hover effects and smooth transitions for user interaction
 * - Netflix-Style Design: Familiar play button patterns for platform credibility
 * - Icon Integration: Play icon with text for clear user understanding
 *
 * Responsive Design Strategy:
 * - Mobile (default): Smaller padding and text size for touch optimization
 * - Medium screens (md): Medium padding for balanced appearance
 * - Large screens (lg): Larger text size for better readability
 * - Consistent spacing and sizing across all breakpoints
 *
 * Navigation Flow:
 * 1. User clicks play button on any component (billboard, movie card, modal)
 * 2. Router navigates to /watch/[movieId] with specific movie ID
 * 3. Watch page loads movie data and displays full-screen video player
 * 4. Video starts playing automatically for seamless streaming experience
 * 5. User gains access to complete video streaming functionality
 *
 * Usage Contexts:
 * - Billboard: Featured content play button for immediate streaming
 * - MovieCard: Individual movie play button in grid layouts
 * - InfoModal: Detailed movie information with play button
 * - Any Component: Reusable play button for any movie context
 *
 * @param props - Component props containing the movie identification
 * @param props.movieId - Unique identifier for the movie to stream
 * @returns JSX.Element - The rendered interactive play button
 *
 * @example
 * ```typescript
 * // Basic usage in movie card
 * const movie = { id: '123', title: 'Movie Title' };
 *
 * return (
 *   <div>
 *     <img src={movie.thumbnailUrl} alt={movie.title} />
 *     <PlayButton movieId={movie.id} />
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in billboard component
 * const { data: featuredMovie } = useBillboard();
 *
 * return (
 *   <div className="billboard">
 *     <h1>{featuredMovie?.title}</h1>
 *     <PlayButton movieId={featuredMovie?.id} />
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in info modal
 * const { data: movie } = useMovie(movieId);
 *
 * return (
 *   <InfoModal>
 *     <div className="movie-details">
 *       <h2>{movie?.title}</h2>
 *       <PlayButton movieId={movie?.id} />
 *     </div>
 *   </InfoModal>
 * );
 * ```
 *
 * @see {@link pages/watch/[movieId].tsx} Video streaming page that this button navigates to
 * @see {@link components/Billboard.tsx} Featured content with play button
 * @see {@link components/InfoModal.tsx} Movie details modal with play button
 * @see {@link components/MovieCard.tsx} Movie card with play button integration
 * @see {@link pages/browse.tsx} Main browsing page with play button usage
 */
const PlayButton: React.FC<PlayButtonProps> = ({ movieId }) => {
  /**
   * Router for Navigation
   *
   * Next.js router instance for programmatic navigation to the video streaming
   * page. This enables the play button to redirect users to the full-screen
   * video experience when clicked.
   *
   * Why router is essential for the streaming platform:
   * - Video Streaming: Enables navigation to /watch/[movieId] for video playback
   * - User Experience: Provides seamless flow from content discovery to streaming
   * - Dynamic Routing: Supports any movie ID for streaming access
   * - Platform Integration: Connects play buttons to the streaming experience
   */
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/watch/${movieId}`)}
      className="
  bg-white
  rounded-md
  py-1 md:py-2
  px-2 md:px-4
  w-auto
  text-xs lg:text-lg
  font-semibold
  flex
  flex-row
  items-center
  hover:bg-neutral-300
  transition"
    >
      <BsFillPlayFill size={25} className="mr-1" /> Play
    </button>
  );
};

export default PlayButton;
