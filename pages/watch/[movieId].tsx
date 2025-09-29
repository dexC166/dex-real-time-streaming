/**
 * Video Streaming Page for DEX Real-Time Streaming Platform
 *
 * This is the dedicated video streaming page that provides authenticated users with
 * full-screen video playback for individual movies. It implements a Netflix-like
 * streaming experience with immersive video viewing, navigation controls, and
 * seamless integration with the platform's content discovery system.
 *
 * Key architectural decisions for the streaming platform:
 * - Dynamic Routing: Uses Next.js dynamic routing with [movieId] parameter
 * - Full-Screen Experience: Provides immersive video viewing without distractions
 * - Navigation Integration: Enables seamless return to main browsing interface
 * - Video Optimization: Optimized for streaming with autoplay and native controls
 * - User Experience: Familiar Netflix-like streaming interface for credibility
 *
 * The streaming platform relies on this page for:
 * - Video Streaming: Primary interface for full-screen video playback
 * - Content Consumption: Enables users to watch streaming content
 * - User Experience: Provides immersive viewing experience without distractions
 * - Navigation: Seamless integration with content discovery and browsing
 *
 * @see {@link components/PlayButton.tsx} Play button component that navigates here
 * @see {@link components/Billboard.tsx} Featured content with play button
 * @see {@link components/InfoModal.tsx} Movie details modal with play button
 * @see {@link components/MovieCard.tsx} Movie card with click-to-watch functionality
 * @see {@link hooks/useMovie.ts} Movie data hook for streaming content
 * @see {@link pages/browse.tsx} Main browsing page that links to this page
 */

import React from 'react';
import useMovie from '@/hooks/useMovie';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

/**
 * Video Streaming Component
 *
 * This component renders the complete video streaming interface for individual
 * movies, providing full-screen video playback with navigation controls and
 * immersive viewing experience. It's designed to deliver a Netflix-like
 * streaming experience with seamless integration to the platform's content
 * discovery system.
 *
 * Why this component is essential for the streaming platform:
 * - Video Streaming: Primary interface for full-screen video playback
 * - Content Consumption: Enables users to watch streaming content
 * - User Experience: Provides immersive viewing experience without distractions
 * - Navigation: Seamless integration with content discovery and browsing
 *
 * Component Architecture:
 * - Dynamic Movie ID: Extracts movieId from URL parameters for content loading
 * - Movie Data Fetching: Uses useMovie hook for streaming content and metadata
 * - Navigation Controls: Provides back button for return to main interface
 * - Video Player: Native HTML5 video with autoplay and controls
 * - Responsive Design: Optimized for all devices and screen sizes
 *
 * User Experience Flow:
 * 1. User clicks play button from browse page, billboard, or movie card
 * 2. User is redirected to /watch/[movieId] with specific movie ID
 * 3. Page loads movie data and displays full-screen video player
 * 4. Video starts playing automatically with native controls
 * 5. User can navigate back to main interface using back button
 * 6. User gains immersive video streaming experience
 *
 * Video Streaming Features:
 * - Full-Screen Display: Immersive viewing without UI distractions
 * - Autoplay: Video starts playing immediately for seamless experience
 * - Native Controls: Standard video controls for play, pause, seek, volume
 * - Responsive Design: Optimized for all devices and screen sizes
 * - Navigation: Easy return to main browsing interface
 *
 * @returns JSX.Element - The complete video streaming interface
 *
 * @example
 * ```typescript
 * // User journey example
 * // 1. User clicks play button on movie card → navigates to /watch/123
 * // 2. Page loads movie data for ID 123
 * // 3. Video starts playing automatically
 * // 4. User watches content with full-screen experience
 * // 5. User clicks back button → returns to /browse
 * ```
 *
 * @see {@link components/PlayButton.tsx} Play button component
 * @see {@link components/Billboard.tsx} Featured content with play button
 * @see {@link components/InfoModal.tsx} Movie details modal with play button
 * @see {@link components/MovieCard.tsx} Movie card with click-to-watch
 * @see {@link hooks/useMovie.ts} Movie data hook for streaming content
 * @see {@link pages/browse.tsx} Main browsing page that links here
 */
const Watch = () => {
  /**
   * Router for Navigation and URL Parameters
   *
   * Next.js router instance for programmatic navigation and URL parameter access.
   * This enables the watch page to extract the movie ID from the URL and handle
   * navigation back to the main browsing interface.
   *
   * Why router is essential for the streaming platform:
   * - URL Parameter Access: Extracts movieId from /watch/[movieId] URL
   * - Navigation: Handles programmatic routing back to main interface
   * - User Experience: Enables seamless flow from content discovery to streaming
   * - Dynamic Routing: Supports dynamic movie ID routing for any content
   */
  const router = useRouter();

  /**
   * Movie ID from URL Parameters
   *
   * Extracts the movie ID from the URL parameters using Next.js dynamic routing.
   * This enables the page to load the specific movie data for streaming.
   *
   * Why movieId extraction is crucial for the streaming platform:
   * - Content Loading: Enables loading specific movie data for streaming
   * - Dynamic Routing: Supports any movie ID in the URL structure
   * - User Experience: Allows direct linking to specific movie streaming
   * - API Integration: Provides movie ID for data fetching and streaming
   *
   * URL Structure:
   * - /watch/[movieId] - Dynamic route with movie ID parameter
   * - movieId is extracted from router.query for data fetching
   * - Supports any valid movie ID from the platform's catalog
   */
  const { movieId } = router.query;

  /**
   * Movie Data for Streaming
   *
   * Fetches the specific movie data using the useMovie hook with the movie ID
   * from the URL. This provides all necessary information for video streaming
   * including the video URL, title, and metadata.
   *
   * Why movie data is essential for the streaming platform:
   * - Video Streaming: Provides video URL for HTML5 video player
   * - User Experience: Displays movie title and metadata in navigation
   * - Content Access: Enables full-screen video playback
   * - Platform Integration: Connects content discovery to streaming experience
   *
   * Data Structure:
   * - videoUrl: Direct URL to video file for streaming playback
   * - title: Movie title for display in navigation header
   * - thumbnailUrl: Thumbnail image for video fallback
   * - description: Movie description for additional context
   * - All fields from the Movie model in Prisma schema
   */
  const { data } = useMovie(movieId as string);

  return (
    <div
      className="
  h-screen w-screen bg-black"
    >
      <nav
        className="
    fixed
    w-full
    p-4
    z-10
    flex
    flex-row
    items-center
    gap-8
    bg-black
    bg-opacity-70"
      >
        <AiOutlineArrowLeft
          onClick={() => router.push('/')}
          className="
        text-white
        cursor-pointer"
          size={40}
        />
        <p
          className="
        text-white
        text-1xl
        md:text-3xl
        font-bold"
        >
          <span
            className="
          font-light"
          >
            Watching:
          </span>
          {data?.title}
        </p>
      </nav>
      <video
        autoPlay
        controls
        className="
      h-full
      w-full"
        src={data?.videoUrl}
      ></video>
    </div>
  );
};

export default Watch;
