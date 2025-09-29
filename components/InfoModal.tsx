/**
 * Movie Information Modal Component for DEX Real-Time Streaming Platform
 *
 * This is a sophisticated modal component that displays detailed movie information
 * with autoplay video previews, interactive controls, and comprehensive movie
 * metadata. It implements a Netflix-like movie detail experience with smooth
 * animations, responsive design, and seamless integration with the platform's
 * content discovery and personalization system.
 *
 * Key architectural decisions for the streaming platform:
 * - Overlay Design: Full-screen overlay with backdrop for immersive movie experience
 * - Video Integration: Autoplay video previews with poster fallbacks for engagement
 * - Interactive Controls: Play button and favorite button for immediate user actions
 * - Smooth Animations: Scale and fade transitions for polished user experience
 * - Netflix-Style Design: Familiar modal patterns for streaming platform credibility
 *
 * The streaming platform relies on this component for:
 * - Content Discovery: Detailed movie information without navigation
 * - User Experience: Immersive movie previews and interactive features
 * - Personalization: Favorite management and user-specific interactions
 * - Engagement: Rich media content and smooth interactions for user retention
 *
 * @see {@link pages/browse.tsx} Main browsing page using this modal
 * @see {@link components/MovieCard.tsx} Movie card component triggering this modal
 * @see {@link components/Billboard.tsx} Billboard component triggering this modal
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link hooks/useMovie.ts} Individual movie data hook
 * @see {@link components/PlayButton.tsx} Play button component
 * @see {@link components/FavoriteButton.tsx} Favorite management component
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import PlayButton from './PlayButton';
import FavoriteButton from './FavoriteButton';
import useInfoModal from '@/hooks/useInfoModal';
import useMovie from '@/hooks/useMovie';

/**
 * Info Modal Props Interface
 *
 * Defines the TypeScript interface for the InfoModal component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all modal display contexts in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all modal instances receive proper visibility and close handlers
 * - API Contract: Provides clear interface for modal component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes modal prop structure across the platform
 *
 * @interface InfoModalProps
 * @property {boolean} [visible] - Optional boolean flag controlling modal visibility
 * @property {Function} onClose - Function to call when modal should be closed
 */
interface InfoModalProps {
  /** Optional boolean flag controlling modal visibility */
  visible?: boolean;
  /** Function to call when modal should be closed */
  onClose: any;
}

/**
 * Movie Information Modal Component
 *
 * This component renders a full-screen modal overlay that displays detailed
 * movie information with autoplay video previews, interactive controls, and
 * comprehensive metadata. It's designed to provide an immersive movie
 * discovery experience with smooth animations and Netflix-like design patterns.
 *
 * Why this component is essential for the streaming platform:
 * - Content Discovery: Detailed movie information without navigation
 * - User Experience: Immersive movie previews and interactive features
 * - Personalization: Favorite management and user-specific interactions
 * - Engagement: Rich media content and smooth interactions for user retention
 *
 * Component Features:
 * - Full-Screen Overlay: Immersive backdrop with smooth animations
 * - Video Integration: Autoplay video previews with poster fallbacks
 * - Interactive Controls: Play button and favorite button for immediate actions
 * - Movie Metadata: Complete movie information including title, description, genre
 * - Responsive Design: Adapts to different screen sizes with appropriate scaling
 * - Netflix-Style Design: Familiar modal patterns for platform credibility
 *
 * Animation Strategy:
 * - Scale Animation: Modal content scales from 0 to 100% for smooth appearance
 * - Backdrop Fade: Semi-transparent backdrop for focus and immersion
 * - Close Animation: Delayed close with scale animation for smooth dismissal
 * - Video Integration: Seamless video previews with poster fallbacks
 *
 * User Experience Flow:
 * 1. User clicks info button on movie card or billboard
 * 2. Modal appears with smooth scale animation and backdrop
 * 3. Video preview starts playing automatically with movie metadata
 * 4. User can interact with play button or favorite button
 * 5. User can close modal with close button or backdrop click
 * 6. Modal disappears with smooth animation and returns to browsing
 *
 * @param props - Component props containing the modal configuration
 * @param props.visible - Optional boolean flag controlling modal visibility
 * @param props.onClose - Function to call when modal should be closed
 * @returns JSX.Element | null - The rendered modal overlay or null if not visible
 *
 * @example
 * ```typescript
 * // Basic usage in main page
 * const { isOpen, closeModal } = useInfoModal();
 *
 * return (
 *   <>
 *     <InfoModal visible={isOpen} onClose={closeModal} />
 *     <div>Main content</div>
 *   </>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with custom close handler
 * const handleModalClose = () => {
 *   console.log('Modal closed');
 *   // Custom close logic
 * };
 *
 * return (
 *   <InfoModal
 *     visible={showModal}
 *     onClose={handleModalClose}
 *   />
 * );
 * ```
 *
 * @see {@link pages/browse.tsx} Main browsing page using this modal
 * @see {@link components/MovieCard.tsx} Movie card component triggering this modal
 * @see {@link components/Billboard.tsx} Billboard component triggering this modal
 * @see {@link hooks/useInfoModal.ts} Modal state management hook
 * @see {@link hooks/useMovie.ts} Individual movie data hook
 * @see {@link components/PlayButton.tsx} Play button component
 * @see {@link components/FavoriteButton.tsx} Favorite management component
 */
const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  /**
   * Modal Visibility State
   *
   * Tracks the internal visibility state of the modal for animation purposes.
   * This enables smooth scale animations by controlling when the modal content
   * is visible versus when the modal should be rendered in the DOM.
   *
   * Why internal visibility state is crucial for the streaming platform:
   * - Animation Control: Enables smooth scale animations for modal appearance
   * - User Experience: Provides polished transitions for modal interactions
   * - Performance: Prevents unnecessary DOM rendering when modal is not visible
   * - Visual Polish: Creates professional, Netflix-like modal behavior
   *
   * Animation Strategy:
   * - Initial State: Set to visible prop value for immediate state sync
   * - Scale Animation: Controls scale-100 vs scale-0 for smooth transitions
   * - Delayed Close: Allows animation to complete before calling onClose
   * - State Synchronization: Updates when visible prop changes
   */
  const [isVisible, setIsVisible] = useState(!!visible);

  /**
   * Movie Context from Global State
   *
   * Accesses the movieId from the global modal state management. This provides
   * the context for which movie should be displayed in the modal, enabling
   * dynamic content loading based on user interactions throughout the platform.
   *
   * Why movie context is essential for the streaming platform:
   * - Dynamic Content: Enables modal to display different movies based on user selection
   * - Global State: Allows any component to trigger modal with specific movie
   * - User Experience: Provides seamless movie information access from anywhere
   * - Content Discovery: Powers the main content discovery and interaction system
   */
  const { movieId } = useInfoModal();

  /**
   * Individual Movie Data
   *
   * Fetches detailed movie information using the useMovie hook with the movieId
   * from global state. This provides complete movie metadata for display in
   * the modal, including video URLs, thumbnails, and descriptive information.
   *
   * Why individual movie data is crucial for the streaming platform:
   * - Content Display: Provides complete movie information for modal display
   * - Video Integration: Enables autoplay video previews with proper URLs
   * - User Experience: Powers rich media content and interactive features
   * - Content Discovery: Enables detailed movie information for user decisions
   *
   * Data Structure:
   * - Complete movie metadata (title, description, genre, duration)
   * - Streaming URL for video preview playback
   * - Thumbnail URL for poster display and video fallback
   * - All fields from the Movie model in Prisma schema
   * - Defaults to empty object for safe rendering
   */
  const { data = {} } = useMovie(movieId);

  /**
   * Visibility State Synchronization Effect
   *
   * Synchronizes the internal visibility state with the visible prop to ensure
   * smooth animations and proper state management. This effect handles the
   * transition between modal states and maintains consistency with parent components.
   *
   * Why this synchronization is essential for the streaming platform:
   * - State Consistency: Ensures internal state matches parent component state
   * - Animation Control: Enables smooth transitions between modal states
   * - User Experience: Provides consistent modal behavior across the platform
   * - Performance: Prevents unnecessary re-renders and state conflicts
   *
   * Implementation Details:
   * - Updates isVisible when visible prop changes
   * - Uses double negation (!!visible) for boolean conversion
   * - Enables smooth scale animations for modal appearance
   * - Maintains state consistency with global modal management
   */
  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  /**
   * Modal Close Handler
   *
   * Handles the modal close action with smooth animation timing. This function
   * implements a delayed close pattern that allows the scale animation to
   * complete before calling the parent's onClose function.
   *
   * Why this handler is crucial for the streaming platform:
   * - User Experience: Provides smooth close animations for polished interactions
   * - Animation Timing: Ensures scale animation completes before modal unmounts
   * - State Management: Properly coordinates internal state with parent callbacks
   * - Visual Polish: Creates professional, Netflix-like modal behavior
   *
   * Close Animation Strategy:
   * 1. Immediately set isVisible to false to trigger scale-0 animation
   * 2. Wait 300ms for scale animation to complete
   * 3. Call onClose to unmount modal and clean up resources
   * 4. Provide smooth visual transition for user experience
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Depends on onClose for proper memoization
   * - Implements delayed close with setTimeout for animation timing
   * - Ensures smooth user experience with proper animation coordination
   */
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  /**
   * Early Return for Hidden Modal
   *
   * Returns null when the modal should not be visible, preventing unnecessary
   * DOM rendering and improving performance. This ensures the modal is only
   * rendered when needed and maintains clean component lifecycle management.
   *
   * Why early return is important for the streaming platform:
   * - Performance: Prevents unnecessary DOM rendering when modal is hidden
   * - Resource Management: Reduces memory usage and improves performance
   * - Clean UI: Prevents visual artifacts when modal should be hidden
   * - User Experience: Ensures modal only appears when intended
   */
  if (!visible) {
    return null;
  }

  return (
    <div
      className="
  z-50
  transition
  duration-300
  bg-black
  bg-opacity-80
  flex
  justify-center
  items-center
  overflow-x-hidden
  overflow-y-auto
  fixed
  inset-0"
    >
      <div
        className="
      relative
      w-auto
      mx-auto
      max-w-3xl
      rounded-md
      overflow-hidden"
      >
        <div
          className={`
          ${isVisible ? 'scale-100' : 'scale-0'}
          transform
          duration-300
          relative
          flex-auto
          bg-zinc-900
          drop-shadow-md`}
        >
          <div
            className="
            relative h-96
          "
          >
            <video
              className="
                w-full
                brightness-[60%]
                object-cover
                h-full"
              autoPlay
              muted
              loop
              poster={data?.thumbnailUrl}
              src={data?.videoUrl}
            ></video>
            <div
              className="
                cursor-pointer
                absolute
                top-3
                right-3
                h-10
                w-10
                rounded-full
                bg-black
                bg-opacity-70
                flex
                items-center
                justify-center"
              onClick={handleClose}
            >
              <AiOutlineClose className="text-white" size={20} />
            </div>

            <div
              className="
            absolute
            bottom-[10%]
            left-10"
            >
              <p
                className="
                text-white
                text-3xl
                md:text-4xl
                h-full
                lg:text-5xl
                font-bold
                mb-8"
              >
                {data?.title}
              </p>
              <div
                className="
                flex 
                flex-row
                gap-4
                items-center"
              >
                <PlayButton movieId={data?.id} />
                <FavoriteButton movieId={data?.id} />
              </div>
            </div>
          </div>

          <div className="px-12 py-8">
            <p className="text-green-400 font-semibold text-lg">New</p>
            <p className="text-white text-lg">{data?.duration}</p>
            <p className="text-white text-lg">{data?.genre}</p>
            <p className="text-white text-lg">{data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
