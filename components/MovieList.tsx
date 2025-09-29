/**
 * Movie List Grid Component for DEX Real-Time Streaming Platform
 *
 * This is a reusable movie grid component that displays collections of movies
 * in responsive grid layouts. It powers content discovery sections like
 * "Trending Now" and "My List" throughout the streaming platform, providing
 * a Netflix-like browsing experience with responsive design and interactive
 * movie cards.
 *
 * Key architectural decisions for the streaming platform:
 * - Responsive Grid: Adapts to different screen sizes with appropriate column counts
 * - Conditional Rendering: Only displays when data is available to prevent empty sections
 * - Reusable Design: Single component for all movie list sections across the platform
 * - Netflix-Style Layout: Familiar grid patterns for streaming platform credibility
 * - Performance: Optimized for rendering large collections of movie data
 *
 * The streaming platform relies on this component for:
 * - Content Discovery: Powers main browsing interface with movie grids
 * - Personalization: Displays user-specific content sections like "My List"
 * - User Experience: Provides consistent movie browsing experience across all sections
 * - Responsive Design: Ensures optimal viewing on all device sizes
 *
 * @see {@link pages/browse.tsx} Main browsing page using this component
 * @see {@link components/MovieCard.tsx} Individual movie display component
 * @see {@link hooks/useMovieList.ts} Movie catalog data hook
 * @see {@link hooks/useFavorites.ts} User favorites data hook
 */

import React from 'react';
import MovieCard from '@/components/MovieCard';
import { isEmpty } from 'lodash';

/**
 * Movie List Props Interface
 *
 * Defines the TypeScript interface for the MovieList component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all movie list sections in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all movie lists receive proper data and title
 * - API Contract: Provides clear interface for component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes movie list data structure across the platform
 *
 * @interface MovieListProps
 * @property {Record<string, any>[]} data - Array of movie objects with complete metadata
 * @property {string} title - Display title for the movie list section
 */
interface MovieListProps {
  /** Array of movie objects with complete metadata for display */
  data: Record<string, any>[];
  /** Display title for the movie list section (e.g., "Trending Now", "My List") */
  title: string;
}

/**
 * Movie List Grid Component
 *
 * This component renders a responsive grid of movie cards with a section title.
 * It's designed to be reusable across all movie list sections in the streaming
 * platform, providing consistent layout and behavior for content discovery
 * and personalization features.
 *
 * Why this component is essential for the streaming platform:
 * - Content Discovery: Powers main browsing interface with movie grids
 * - Personalization: Displays user-specific content sections like "My List"
 * - User Experience: Provides consistent movie browsing experience across all sections
 * - Responsive Design: Ensures optimal viewing on all device sizes
 *
 * Component Features:
 * - Responsive Grid: Adapts column count based on screen size
 * - Conditional Rendering: Only displays when data is available
 * - Section Titles: Clear labeling for different content categories
 * - Movie Cards: Individual movie display with interactive features
 * - Netflix-Style Design: Familiar grid patterns for streaming platform credibility
 *
 * Responsive Grid Strategy:
 * - Mobile (default): 2 columns for optimal touch interaction
 * - Small screens (xs): 2 columns for better content visibility
 * - Medium screens (md): 3 columns for balanced layout
 * - Large screens (lg): 4 columns for maximum content density
 * - Gap spacing: Responsive spacing between grid items
 *
 * Content Sections Supported:
 * - "Trending Now": Main movie catalog with popular and current content
 * - "My List": User's personalized favorites and saved content
 * - Custom Sections: Any movie collection with appropriate title
 * - Future Sections: Easily extensible for new content categories
 *
 * User Experience Flow:
 * 1. User sees section title identifying the content category
 * 2. User views responsive grid of movie cards
 * 3. User can interact with individual movie cards
 * 4. User experiences consistent layout across all sections
 * 5. User gains access to streaming content through movie cards
 *
 * @param props - Component props containing the movie list configuration
 * @param props.data - Array of movie objects with complete metadata
 * @param props.title - Display title for the movie list section
 * @returns JSX.Element | null - The rendered movie grid or null if no data
 *
 * @example
 * ```typescript
 * // Basic usage with movie catalog
 * const { data: movies } = useMovieList();
 *
 * return (
 *   <MovieList
 *     title="Trending Now"
 *     data={movies}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with user favorites
 * const { data: favorites } = useFavorites();
 *
 * return (
 *   <MovieList
 *     title="My List"
 *     data={favorites}
 *   />
 * );
 * ```
 *
 * @see {@link pages/browse.tsx} Main browsing page using this component
 * @see {@link components/MovieCard.tsx} Individual movie display component
 * @see {@link hooks/useMovieList.ts} Movie catalog data hook
 * @see {@link hooks/useFavorites.ts} User favorites data hook
 */
const MovieList: React.FC<MovieListProps> = ({ data, title }) => {
  /**
   * Empty Data Check
   *
   * Uses Lodash's isEmpty function to check if the data array is empty or undefined.
   * Returns null to prevent rendering empty sections, maintaining a clean UI
   * and preventing layout issues when no movies are available.
   *
   * Why this check is crucial for the streaming platform:
   * - User Experience: Prevents empty sections from cluttering the interface
   * - Layout Integrity: Maintains consistent spacing and visual hierarchy
   * - Performance: Avoids unnecessary DOM rendering for empty content
   * - Clean UI: Ensures only meaningful content is displayed to users
   *
   * Empty Data Scenarios:
   * - New users with no favorites in "My List"
   * - API errors or loading states with no data
   * - Filtered results that return no matches
   * - Network issues preventing data fetching
   */
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {data.map((movie) => (
            <div
              key={movie.id}
              className="w-full aspect-video xs:aspect-[16/9] sm:aspect-video"
            >
              <MovieCard data={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
