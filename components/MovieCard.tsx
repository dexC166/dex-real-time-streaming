/**
 * Interactive Movie Card Component for DEX Real-Time Streaming Platform
 *
 * This is a sophisticated movie card component that displays individual movies
 * with interactive features, responsive design, and mobile-optimized behaviors.
 * It implements a Netflix-like movie card experience with hover effects,
 * mobile expansion, play buttons, favorites, and detailed information access.
 *
 * Key architectural decisions for the streaming platform:
 * - Responsive Design: Adapts to different screen sizes with appropriate scaling
 * - Mobile-First: Special mobile interactions with expansion and touch optimization
 * - Interactive Features: Play button, favorites, and info modal integration
 * - Netflix-Style Design: Familiar card patterns for streaming platform credibility
 * - Performance: Optimized for rendering large collections of movie cards
 *
 * The streaming platform relies on this component for:
 * - Content Discovery: Individual movie display in grid layouts
 * - User Interaction: Play buttons, favorites, and detailed information access
 * - Mobile Experience: Touch-optimized interactions for mobile devices
 * - Visual Appeal: Engaging hover effects and smooth transitions
 *
 * @see {@link components/MovieList.tsx} Movie grid component using this card
 * @see {@link components/FavoriteButton.tsx} Favorite management component
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 * @see {@link pages/browse.tsx} Main browsing page with movie grids
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModal';
import { BiChevronDown } from 'react-icons/bi';
import { BsFillPlayFill } from 'react-icons/bs';

/**
 * Movie Card Props Interface
 *
 * Defines the TypeScript interface for the MovieCard component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all movie display contexts in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all movie cards receive proper movie data
 * - API Contract: Provides clear interface for component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes movie card data structure across the platform
 *
 * @interface MovieCardProps
 * @property {Record<string, any>} data - Movie object with complete metadata
 */
interface MovieCardProps {
  /** Movie object with complete metadata for display and interaction */
  data: Record<string, any>;
}

/**
 * Interactive Movie Card Component
 *
 * This component renders an individual movie card with interactive features,
 * responsive design, and mobile-optimized behaviors. It's designed to provide
 * a Netflix-like movie browsing experience with hover effects, mobile expansion,
 * and seamless integration with the platform's content discovery system.
 *
 * Why this component is essential for the streaming platform:
 * - Content Discovery: Individual movie display in grid layouts
 * - User Interaction: Play buttons, favorites, and detailed information access
 * - Mobile Experience: Touch-optimized interactions for mobile devices
 * - Visual Appeal: Engaging hover effects and smooth transitions
 *
 * Component Features:
 * - Responsive Design: Adapts to different screen sizes with appropriate scaling
 * - Mobile Expansion: Special mobile interactions with touch-optimized expansion
 * - Interactive Controls: Play button, favorites, and info modal integration
 * - Hover Effects: Smooth transitions and visual feedback for desktop users
 * - Netflix-Style Design: Familiar card patterns for streaming platform credibility
 *
 * Mobile vs Desktop Behavior:
 * - Desktop: Hover effects reveal interactive controls and movie details
 * - Mobile: Tap to expand card with full interactive controls and close button
 * - Responsive Scaling: Different card sizes and button sizes for optimal viewing
 * - Touch Optimization: Appropriate touch targets and gesture handling
 *
 * Interactive Features:
 * - Play Button: Direct navigation to video streaming page
 * - Favorite Button: Add/remove movies from user's favorites list
 * - Info Button: Open detailed movie information modal
 * - Mobile Expansion: Full-screen mobile experience with close button
 *
 * User Experience Flow:
 * 1. User sees movie thumbnail in grid layout
 * 2. User hovers (desktop) or taps (mobile) to reveal controls
 * 3. User can play movie, add to favorites, or view details
 * 4. User experiences smooth transitions and visual feedback
 * 5. User gains access to streaming content and personalization features
 *
 * @param props - Component props containing the movie data
 * @param props.data - Movie object with complete metadata for display and interaction
 * @returns JSX.Element - The rendered interactive movie card
 *
 * @example
 * ```typescript
 * // Basic usage in movie grid
 * const movie = { id: '123', title: 'Movie Title', thumbnailUrl: '...' };
 *
 * return (
 *   <MovieCard data={movie} />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in MovieList component
 * {movies.map(movie => (
 *   <MovieCard key={movie.id} data={movie} />
 * ))}
 * ```
 *
 * @see {@link components/MovieList.tsx} Movie grid component using this card
 * @see {@link components/FavoriteButton.tsx} Favorite management component
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 * @see {@link pages/browse.tsx} Main browsing page with movie grids
 */
const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  /**
   * Router for Navigation
   *
   * Next.js router instance for programmatic navigation to the video streaming
   * page. This enables the movie card to redirect users to the full-screen
   * video experience when they click the play button.
   *
   * Why router is essential for the streaming platform:
   * - Video Streaming: Enables navigation to /watch/[movieId] for video playback
   * - User Experience: Provides seamless flow from content discovery to streaming
   * - Dynamic Routing: Supports any movie ID for streaming access
   * - Platform Integration: Connects movie cards to the streaming experience
   */
  const router = useRouter();

  /**
   * Modal State Management
   *
   * Accesses the openModal function from the useInfoModal hook to enable
   * detailed movie information display. This allows users to see comprehensive
   * movie details without leaving the main browsing experience.
   *
   * Why modal integration is important for the streaming platform:
   * - User Experience: Enables detailed movie information without navigation
   * - Content Discovery: Provides quick access to movie details and actions
   * - Interactive Features: Powers the info button functionality
   * - Engagement: Creates interactive experiences for content consumption
   */
  const { openModal } = useInfoModalStore();

  /**
   * Mobile Expansion State
   *
   * Tracks whether the movie card is expanded on mobile devices. This enables
   * mobile users to access interactive controls and movie details through
   * a touch-optimized expansion interface.
   *
   * Why mobile expansion state is crucial for the streaming platform:
   * - Mobile Experience: Enables touch-optimized interactions for mobile devices
   * - User Interface: Provides full-screen mobile experience with all controls
   * - Touch Optimization: Ensures appropriate touch targets and gesture handling
   * - User Experience: Creates intuitive mobile browsing experience
   */
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  /**
   * Watch Page Navigation Handler
   *
   * Navigates to the video streaming page for the current movie. This function
   * is optimized with useCallback to prevent unnecessary re-renders and
   * provides seamless navigation to the full-screen video experience.
   *
   * Why this handler is essential for the streaming platform:
   * - Video Streaming: Enables navigation to full-screen video playback
   * - User Experience: Provides seamless flow from content discovery to streaming
   * - Performance: Uses useCallback for optimization and prevents re-renders
   * - Platform Integration: Connects movie cards to the streaming experience
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Depends on router and data.id for proper memoization
   * - Navigates to /watch/[movieId] for video streaming
   * - Enables seamless video streaming experience
   */
  const redirectToWatch = useCallback(
    () => router.push(`/watch/${data.id}`),
    [router, data.id]
  );

  /**
   * Card Click Handler
   *
   * Handles card clicks with different behaviors for mobile and desktop devices.
   * On mobile devices, it toggles the expansion state for touch-optimized
   * interactions. On desktop devices, it directly navigates to the video
   * streaming page for immediate content access.
   *
   * Why this handler is crucial for the streaming platform:
   * - Responsive Design: Enables different behaviors for mobile and desktop
   * - Mobile Experience: Provides touch-optimized expansion for mobile users
   * - Desktop Experience: Enables immediate video streaming for desktop users
   * - User Experience: Creates intuitive interactions across all devices
   *
   * Device-Specific Behavior:
   * - Mobile (< 640px): Toggles expansion state for touch-optimized controls
   * - Desktop (≥ 640px): Direct navigation to video streaming page
   * - Breakpoint: Uses 640px (Tailwind's sm breakpoint) for device detection
   * - User Experience: Optimized interactions for each device type
   */
  const handleCardClick = () => {
    if (window.innerWidth < 640) {
      // sm breakpoint in Tailwind
      setIsMobileExpanded(!isMobileExpanded);
    } else {
      redirectToWatch();
    }
  };

  return (
    <div className="group bg-zinc-900 col-span relative h-[30vw] sm:h-[30vw] md:h-[20vw] lg:h-[12vw] xs:h-[30vw]">
      <img
        onClick={handleCardClick}
        src={data.thumbnailUrl}
        alt="Movie"
        draggable={false}
        className={`
          cursor-pointer
          object-cover
          transition
          duration
          shadow-xl
          rounded-md
          group-hover:opacity-90
          sm:group-hover:opacity-0
          delay-300
          w-full
          h-full
          ${isMobileExpanded ? 'sm:opacity-100 opacity-0' : 'opacity-100'}
        `}
      />
      <div
        className={`
          absolute
          top-0
          transition
          duration-200
          z-10
          w-full
          h-full
          sm:invisible
          sm:scale-0
          sm:opacity-0
          sm:group-hover:scale-110
          sm:group-hover:-translate-y-[6vw]
          sm:group-hover:translate-x-[2vw]
          sm:group-hover:opacity-100
          sm:group-hover:visible
          ${
            isMobileExpanded
              ? 'opacity-100 scale-110 -translate-y-[6vw] translate-x-[2vw] visible'
              : 'opacity-0 scale-0 invisible'
          }
        `}
      >
        <img
          onClick={redirectToWatch}
          src={data.thumbnailUrl}
          alt="Movie"
          draggable={false}
          className="
            cursor-pointer
            object-cover
            transition
            duration
            shadow-xl
            rounded-t-md
            w-full
            h-[30vw]
            sm:h-[30vw]
            md:h-[20vw]
            lg:h-[12vw]
          "
        />
        <div
          className="
          z-10
          bg-zinc-800
          p-1
          sm:p-2
          lg:p-4
          absolute
          w-full
          transition
          shadow-md
          rounded-b-md
        "
        >
          <div className="flex flex-row items-center gap-1 sm:gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                redirectToWatch();
              }}
              className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
            >
              <BsFillPlayFill className="text-black w-3 sm:w-4 lg:w-6" />
            </div>
            <FavoriteButton movieId={data.id} />
            <div
              onClick={(e) => {
                e.stopPropagation();
                openModal(data?.id);
              }}
              className="cursor-pointer ml-auto group/item w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
            >
              <BiChevronDown className="text-white group-hover/item:text-neutral-300 w-3 sm:w-4 lg:w-6" />
            </div>
          </div>
          <p className="text-green-400 font-semibold mt-1 sm:mt-4 text-xs sm:text-sm">
            New <span className="text-white">2025</span>
          </p>
          <div className="flex flex-row mt-1 sm:mt-4 gap-1 sm:gap-2 items-center">
            <p className="text-white text-[8px] sm:text-[10px] lg:text-sm">
              {data.duration}
            </p>
          </div>
          <div className="flex flex-row items-center gap-1 sm:gap-2 mt-1 sm:mt-4 text-[6px] sm:text-[8px] text-white lg:text-sm">
            <p>{data.genre}</p>
          </div>
        </div>
      </div>
      {/* Mobile close button when expanded */}
      {isMobileExpanded && (
        <button
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 z-20 sm:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileExpanded(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MovieCard;
