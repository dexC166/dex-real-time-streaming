/**
 * Movie Info Modal State Management for DEX Real-Time Streaming Platform
 *
 * This module provides a Zustand-based state management solution for controlling
 * the movie information modal throughout the streaming platform. It enables
 * components to open detailed movie information overlays with specific movie
 * data, creating a seamless user experience for content discovery and interaction.
 *
 * Key architectural decisions for the streaming platform:
 * - Zustand State Management: Lightweight, performant state management for modal control
 * - Global State: Enables modal control from any component without prop drilling
 * - Movie Context: Associates modal state with specific movie data for detailed views
 * - User Experience: Provides smooth modal interactions for content discovery
 *
 * The streaming platform relies on this state management for:
 * - Content Discovery: Enables detailed movie information without navigation
 * - User Experience: Provides quick access to movie details and actions
 * - Interactive Features: Powers play buttons, favorites, and detailed views
 * - Modal Control: Manages modal visibility and movie context across components
 *
 * @see {@link components/InfoModal.tsx} Movie information modal component
 * @see {@link components/MovieCard.tsx} Movie card with modal trigger
 * @see {@link components/Billboard.tsx} Billboard with modal trigger
 * @see {@link pages/browse.tsx} Main page with modal integration
 * @see {@link https://github.com/pmndrs/zustand} Zustand State Management Library
 */

import { create } from 'zustand';

/**
 * Modal Store Interface
 *
 * Defines the TypeScript interface for the movie info modal state management.
 * This interface ensures type safety and provides clear contracts for all
 * components that interact with the modal state.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all modal operations are type-safe across components
 * - API Contract: Provides clear interface for modal state management
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes modal state access across the entire platform
 *
 * Interface Properties:
 * - movieId: Optional string identifier for the currently selected movie
 * - isOpen: Boolean flag indicating whether the modal is currently visible
 * - openModal: Function to open the modal with a specific movie ID
 * - closeModal: Function to close the modal and clear the movie context
 *
 * @see {@link components/InfoModal.tsx} Modal component using this interface
 * @see {@link components/MovieCard.tsx} Movie card using openModal function
 * @see {@link components/Billboard.tsx} Billboard using openModal function
 */
export interface ModalStoreInterface {
  /** Optional movie ID for the currently selected movie in the modal */
  movieId?: string;

  /** Boolean flag indicating whether the modal is currently visible */
  isOpen: boolean;

  /** Function to open the modal with a specific movie ID */
  openModal: (movieId: string) => void;

  /** Function to close the modal and clear the movie context */
  closeModal: () => void;
}

/**
 * Movie Info Modal State Store
 *
 * Creates a Zustand store for managing movie information modal state across
 * the streaming platform. This store provides a centralized way to control
 * modal visibility and associate it with specific movie data for detailed views.
 *
 * Why Zustand for modal state management:
 * - Lightweight: Minimal bundle size impact compared to Redux or Context API
 * - Performance: Optimized re-renders only for components using specific state
 * - Simplicity: Easy to understand and maintain for modal state
 * - TypeScript: Excellent TypeScript support with type inference
 * - No Providers: No need for context providers or complex setup
 *
 * State Management Strategy:
 * - Global State: Accessible from any component without prop drilling
 * - Immutable Updates: Uses Zustand's set function for immutable state updates
 * - Movie Context: Associates modal state with specific movie data
 * - Clean State: Automatically clears movie context when modal closes
 *
 * Streaming Platform Integration:
 * - MovieCard: Uses openModal to show detailed movie information
 * - Billboard: Uses openModal to show featured movie details
 * - InfoModal: Uses movieId to fetch and display specific movie data
 * - Browse Page: Uses isOpen and closeModal for modal visibility control
 *
 * @param set - Zustand's set function for updating store state
 * @returns ModalStoreInterface - The complete modal state management object
 *
 * @example
 * ```typescript
 * // In a component that needs to open the modal
 * const { openModal } = useInfoModal();
 *
 * const handleMovieClick = (movieId: string) => {
 *   openModal(movieId);
 * };
 * ```
 *
 * @example
 * ```typescript
 * // In a component that needs to check modal state
 * const { isOpen, movieId } = useInfoModal();
 *
 * return (
 *   <InfoModal
 *     visible={isOpen}
 *     onClose={() => closeModal()}
 *   />
 * );
 * ```
 *
 * @see {@link components/InfoModal.tsx} Modal component implementation
 * @see {@link components/MovieCard.tsx} Movie card with modal trigger
 * @see {@link components/Billboard.tsx} Billboard with modal trigger
 * @see {@link pages/browse.tsx} Main page with modal integration
 */
const useInfoModal = create<ModalStoreInterface>((set) => ({
  /**
   * Current Movie ID
   *
   * Stores the ID of the movie currently selected for detailed view in the modal.
   * This enables the InfoModal component to fetch and display specific movie data
   * when the modal is opened.
   *
   * Why this is essential for the streaming platform:
   * - Movie Context: Associates modal state with specific movie data
   * - Data Fetching: Enables InfoModal to fetch detailed movie information
   * - User Experience: Provides context for detailed movie views
   * - State Management: Maintains movie selection across modal interactions
   *
   * Initial State: undefined - No movie selected initially
   * Updates: Set when openModal is called, cleared when closeModal is called
   */
  movieId: undefined,

  /**
   * Modal Visibility State
   *
   * Controls whether the movie information modal is currently visible to the user.
   * This boolean flag enables components to conditionally render the modal and
   * manage its visibility state.
   *
   * Why this is crucial for the streaming platform:
   * - User Experience: Controls modal visibility for content discovery
   * - Performance: Prevents unnecessary rendering when modal is closed
   * - State Management: Provides clear visibility state for all components
   * - Accessibility: Enables proper focus management and screen reader support
   *
   * Initial State: false - Modal is closed by default
   * Updates: Set to true when openModal is called, false when closeModal is called
   */
  isOpen: false,

  /**
   * Open Modal Function
   *
   * Opens the movie information modal with a specific movie ID. This function
   * updates both the visibility state and the movie context, enabling the
   * modal to display detailed information for the selected movie.
   *
   * Why this function is essential for the streaming platform:
   * - Content Discovery: Enables users to view detailed movie information
   * - User Experience: Provides quick access to movie details without navigation
   * - State Management: Updates both visibility and movie context atomically
   * - Component Integration: Enables any component to trigger modal display
   *
   * Function Behavior:
   * - Sets isOpen to true to make modal visible
   * - Sets movieId to the provided movie ID for context
   * - Enables InfoModal to fetch and display specific movie data
   * - Provides immediate user feedback for movie selection
   *
   * @param movieId - The ID of the movie to display in the modal
   *
   * @example
   * ```typescript
   * // In MovieCard component
   * const { openModal } = useInfoModal();
   *
   * const handleInfoClick = (movieId: string) => {
   *   openModal(movieId);
   * };
   * ```
   *
   * @see {@link components/MovieCard.tsx} Movie card using this function
   * @see {@link components/Billboard.tsx} Billboard using this function
   */
  openModal: (movieId: string) => set({ isOpen: true, movieId }),

  /**
   * Close Modal Function
   *
   * Closes the movie information modal and clears the movie context. This
   * function resets both the visibility state and the movie ID, ensuring
   * clean state management for subsequent modal interactions.
   *
   * Why this function is crucial for the streaming platform:
   * - User Experience: Provides clear way to close modal and return to browsing
   * - State Management: Ensures clean state for subsequent modal interactions
   * - Performance: Prevents unnecessary data fetching when modal is closed
   * - Memory Management: Clears movie context to prevent memory leaks
   *
   * Function Behavior:
   * - Sets isOpen to false to hide the modal
   * - Sets movieId to undefined to clear movie context
   * - Enables InfoModal to unmount and clean up resources
   * - Prepares state for next modal interaction
   *
   * @example
   * ```typescript
   * // In InfoModal component
   * const { closeModal } = useInfoModal();
   *
   * const handleClose = () => {
   *   closeModal();
   * };
   * ```
   *
   * @see {@link components/InfoModal.tsx} Modal component using this function
   * @see {@link pages/browse.tsx} Main page using this function
   */
  closeModal: () => set({ isOpen: false, movieId: undefined }),
}));

/**
 * Default Export - Movie Info Modal Hook
 *
 * This is the main export that provides the useInfoModal hook to all
 * components in the streaming platform that need to control or access
 * the movie information modal state.
 *
 * Usage Pattern:
 * ```typescript
 * import useInfoModal from '@/hooks/useInfoModal';
 *
 * // In React components
 * const { isOpen, movieId, openModal, closeModal } = useInfoModal();
 * ```
 *
 * Streaming Platform Integration:
 * - All components that need modal control use this hook
 * - Enables seamless movie information display across the platform
 * - Provides consistent state management for modal interactions
 * - Optimized for performance with Zustand's selective re-rendering
 *
 * @see {@link components/InfoModal.tsx} Movie information modal component
 * @see {@link components/MovieCard.tsx} Movie card with modal trigger
 * @see {@link components/Billboard.tsx} Billboard with modal trigger
 * @see {@link pages/browse.tsx} Main page with modal integration
 * @see {@link https://github.com/pmndrs/zustand} Zustand State Management Library
 */
export default useInfoModal;
