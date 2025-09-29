/**
 * Billboard Hero Section Component for DEX Real-Time Streaming Platform
 *
 * This is the main hero section component that displays featured content with
 * autoplay video, movie information, and interactive controls. It implements
 * a Netflix-like billboard experience with responsive design, mobile optimization,
 * and seamless integration with the platform's content discovery system.
 *
 * Key architectural decisions for the streaming platform:
 * - Responsive Video: Adapts video scaling and positioning for different screen sizes
 * - Mobile Optimization: Special handling for mobile devices with different scaling
 * - Autoplay Video: Creates engaging first impression with background video
 * - Interactive Controls: Play button and info modal for content interaction
 * - Netflix-Style Design: Familiar hero section patterns for streaming platform credibility
 *
 * The streaming platform relies on this component for:
 * - First Impression: Creates engaging hero section for content discovery
 * - Featured Content: Displays randomly selected movies to introduce users to content
 * - User Engagement: Provides interactive controls for immediate content access
 * - Visual Appeal: Creates immersive video experience with proper scaling and effects
 *
 * @see {@link pages/browse.tsx} Main browsing page using this billboard
 * @see {@link hooks/useBillboard.ts} Featured content data hook
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link components/PlayButton.tsx} Play button component
 * @see {@link components/InfoModal.tsx} Movie details modal component
 */

import useBillboard from '@/hooks/useBillboard';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import PlayButton from './PlayButton';
import useInfoModal from '@/hooks/useInfoModal';

/**
 * Billboard Hero Section Component
 *
 * This component renders the main hero section with featured content, autoplay video,
 * movie information, and interactive controls. It's designed to create an engaging
 * first impression and introduce users to the streaming platform's content through
 * a Netflix-like billboard experience.
 *
 * Why this component is essential for the streaming platform:
 * - First Impression: Creates engaging hero section for content discovery
 * - Featured Content: Displays randomly selected movies to introduce users to content
 * - User Engagement: Provides interactive controls for immediate content access
 * - Visual Appeal: Creates immersive video experience with proper scaling and effects
 *
 * Component Features:
 * - Responsive Video: Autoplay background video with proper scaling for all devices
 * - Mobile Optimization: Special scaling and positioning for mobile devices
 * - Interactive Controls: Play button for immediate streaming and info modal for details
 * - Content Display: Movie title, description, and metadata with responsive typography
 * - Visual Effects: Brightness adjustment, drop shadows, and smooth transitions
 *
 * Responsive Design Strategy:
 * - Video Scaling: Different scale factors for mobile vs desktop for optimal viewing
 * - Typography: Responsive text sizes from mobile to large desktop screens
 * - Positioning: Adaptive positioning for content overlay across screen sizes
 * - Touch Targets: Appropriate button sizes for mobile and desktop interactions
 *
 * User Experience Flow:
 * 1. User arrives at main browsing page
 * 2. Billboard displays featured movie with autoplay video
 * 3. User sees movie title, description, and interactive controls
 * 4. User can click Play button to start streaming immediately
 * 5. User can click More Info to see detailed movie information
 * 6. User experiences engaging, Netflix-like hero section
 *
 * @returns JSX.Element - The complete billboard hero section interface
 *
 * @example
 * ```typescript
 * // Usage in main browsing page
 * import Billboard from '@/components/Billboard';
 *
 * export default function BrowsePage() {
 *   return (
 *     <>
 *       <Navbar />
 *       <Billboard />
 *       <MovieList title="Trending Now" data={movies} />
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link pages/browse.tsx} Main browsing page using this billboard
 * @see {@link hooks/useBillboard.ts} Featured content data hook
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link components/PlayButton.tsx} Play button component
 * @see {@link components/InfoModal.tsx} Movie details modal component
 */
const Billboard = () => {
  /**
   * Featured Content Data
   *
   * Fetches randomly selected movie data using the useBillboard hook. This provides
   * the featured content for the hero section, including video URL, title, description,
   * and metadata for display and interaction.
   *
   * Why featured content is essential for the streaming platform:
   * - Content Discovery: Introduces users to diverse content through random selection
   * - User Engagement: Creates engaging first impression with featured movies
   * - Visual Appeal: Powers the main hero section with dynamic content
   * - Platform Identity: Establishes the streaming platform's content variety
   *
   * Data Structure:
   * - Complete movie metadata (title, description, genre, duration)
   * - Streaming URLs for video playback in hero section
   * - Thumbnail URLs for poster display and video fallback
   * - Movie ID for play button and info modal interactions
   */
  const { data } = useBillboard();

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
   * - Interactive Features: Powers the "More Info" button functionality
   * - Engagement: Creates interactive experiences for content consumption
   */
  const { openModal } = useInfoModal();

  /**
   * Mobile Device Detection State
   *
   * Tracks whether the current device is mobile (screen width < 640px) to apply
   * appropriate styling and scaling for optimal mobile viewing experience.
   *
   * Why mobile detection is crucial for the streaming platform:
   * - Responsive Design: Enables different scaling and positioning for mobile devices
   * - User Experience: Optimizes video scaling and content layout for mobile screens
   * - Touch Optimization: Ensures appropriate button sizes and touch targets
   * - Performance: Applies mobile-specific optimizations for better performance
   */
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Mobile Device Detection Effect
   *
   * Monitors window resize events to detect mobile devices and update the
   * isMobile state accordingly. This enables responsive design adjustments
   * for optimal viewing experience across all device sizes.
   *
   * Why this effect is essential for the streaming platform:
   * - Responsive Design: Enables real-time device detection for styling adjustments
   * - User Experience: Ensures optimal layout and scaling for all screen sizes
   * - Mobile Optimization: Applies mobile-specific scaling and positioning
   * - Performance: Prevents unnecessary re-renders with proper cleanup
   *
   * Implementation Details:
   * - Initial Check: Detects mobile status on component mount
   * - Resize Listener: Updates mobile status when window is resized
   * - Cleanup: Removes event listener on component unmount
   * - Threshold: Uses 640px as the mobile breakpoint (Tailwind's sm breakpoint)
   */
  useEffect(() => {
    /**
     * Mobile Detection Function
     *
     * Checks if the current window width is less than 640px to determine
     * if the device should be treated as mobile for responsive design purposes.
     *
     * Why 640px threshold for the streaming platform:
     * - Tailwind Compatibility: Matches Tailwind's sm breakpoint (640px)
     * - Mobile Optimization: Ensures proper scaling for mobile devices
     * - User Experience: Provides appropriate layout for small screens
     * - Industry Standard: Common breakpoint for mobile vs desktop distinction
     */
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Modal Open Handler
   *
   * Opens the movie information modal with the current featured movie's ID.
   * This enables users to view detailed movie information without leaving
   * the main browsing experience.
   *
   * Why this handler is essential for the streaming platform:
   * - User Experience: Enables detailed movie information without navigation
   * - Content Discovery: Provides quick access to movie details and actions
   * - Interactive Features: Powers the "More Info" button functionality
   * - Engagement: Creates interactive experiences for content consumption
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Depends on openModal function and data?.id for proper memoization
   * - Handles undefined data gracefully with optional chaining
   * - Enables seamless modal integration with featured content
   */
  const handleOpenModal = useCallback(() => {
    openModal(data?.id);
  }, [openModal, data?.id]);

  return (
    <div className="relative h-[56.25vw] w-full overflow-hidden">
      <video
        className={`
          absolute top-0 left-0 
          w-full
          h-full 
          object-cover
          transform 
          brightness-[60%]
          ${isMobile ? 'scale-[1.4]' : 'scale-[1.4]'}
        `}
        autoPlay
        muted
        loop
        playsInline
        poster={data?.thumbnailUrl}
        src={data?.videoUrl}
      ></video>
      {/* Add a background overlay to prevent black space */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-[-1]"></div>
      <div className="absolute top-[20%] xs:top-[25%] sm:top-[30%] md:top-[40%] ml-4 md:ml-16 w-[90%] md:w-auto">
        <p className="text-white text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">
          {data?.title}
        </p>
        <p className="text-white text-[10px] xs:text-xs sm:text-sm md:text-lg mt-2 xs:mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.description}
        </p>
        <div className="flex flex-row items-center mt-2 xs:mt-3 md:mt-4 gap-2 xs:gap-3">
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="
              bg-white
              text-white
              bg-opacity-30
              rounded-md
              py-1 md:py-2
              px-2 md:px-4
              w-auto
              text-[10px] xs:text-xs md:text-sm lg:text-lg
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
            "
          >
            <AiOutlineInfoCircle className="mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
