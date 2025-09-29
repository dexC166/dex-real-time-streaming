/**
 * Tailwind CSS Configuration for DEX Real-Time Streaming Platform
 *
 * This configuration file defines how Tailwind CSS processes and generates utility classes
 * for the streaming platform's UI components. The configuration is optimized for a Netflix-like
 * interface with complex responsive layouts, dark themes, and smooth animations.
 *
 * Key architectural decisions reflected in this config:
 * - Content Paths: Configured to scan all React components in pages/, components/, and app/ directories
 * - Performance Optimization: Only includes classes actually used in the codebase to minimize bundle size
 * - Responsive Design: Supports mobile-first responsive design patterns used throughout the streaming UI
 * - Dark Theme Support: Optimized for the zinc-900 dark theme used across all components
 *
 * The streaming platform heavily relies on Tailwind for:
 * - Responsive Video Cards: Complex grid layouts with responsive breakpoints (sm:, md:, lg:)
 * - Navigation Components: Fixed positioning, z-index management, and smooth transitions
 * - Interactive Elements: Hover states, focus states, and animation classes for user interactions
 * - Form Styling: Custom input components with floating labels and validation states
 *
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS Configuration Documentation
 * @see {@link https://tailwindcss.com/docs/content-configuration} Content Configuration Guide
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * Content Configuration
   *
   * Defines which files Tailwind should scan for class names. This is crucial for
   * the streaming platform because:
   *
   * Why these specific paths matter:
   * - app directory: Future-proofs for Next.js App Router migration
   * - pages directory: Scans all page components (browse, auth, profiles, watch)
   * - components directory: Includes all UI components (Navbar, MovieCard, Billboard, etc.)
   *
   * Performance Impact:
   * - Only classes actually used in these files will be included in the final CSS bundle
   * - Reduces bundle size significantly for a complex streaming UI with many components
   * - Ensures unused utility classes don't bloat the production build
   *
   * Streaming Platform Context:
   * - The platform uses hundreds of Tailwind classes across components like MovieCard, Navbar, and Billboard
   * - Responsive breakpoints (sm:, md:, lg:) are heavily used for mobile-first video streaming UI
   * - Dark theme classes (bg-zinc-900, text-white) are used consistently across all components
   *
   * @see {@link https://tailwindcss.com/docs/content-configuration} Content Configuration Documentation
   */
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  /**
   * Theme Configuration
   *
   * Currently using default Tailwind theme with no custom extensions. This is intentional
   * for the streaming platform because:
   *
   * Why we're using default theme:
   * - Consistency: Default Tailwind colors (zinc, gray, white) provide a clean, Netflix-like aesthetic
   * - Performance: No custom theme means smaller CSS bundle and faster build times
   * - Maintainability: Easier to maintain and update without custom color definitions
   * - Responsive Design: Default breakpoints (sm: 640px, md: 768px, lg: 1024px) work perfectly
   *   for the streaming platform's responsive video grid layouts
   *
   * Streaming Platform Usage:
   * - Components rely heavily on zinc-900 for dark backgrounds (body, cards, modals)
   * - Gray color palette for text hierarchy and subtle UI elements
   * - Default spacing scale works well for the complex layouts in MovieCard and Navbar components
   * - Default transition durations provide smooth animations for hover states and mobile interactions
   *
   * Future Considerations:
   * - If custom branding colors are needed, they would be added here
   * - Custom breakpoints could be added for specific streaming device targets
   * - Custom spacing could be added for video player controls and overlay positioning
   *
   * @see {@link https://tailwindcss.com/docs/theme} Theme Configuration Documentation
   */
  theme: {
    extend: {},
  },

  /**
   * Plugins Configuration
   *
   * Currently no plugins are configured. This keeps the configuration minimal and focused
   * on the streaming platform's core needs:
   *
   * Why no plugins currently:
   * - Simplicity: The streaming platform's UI requirements are well-served by core Tailwind utilities
   * - Performance: Fewer plugins mean smaller bundle size and faster build times
   * - Maintainability: Less configuration to maintain and debug
   *
   * Potential Future Plugins:
   * - @tailwindcss/forms: Could be useful for enhanced form styling in auth components
   * - @tailwindcss/typography: Might be beneficial for movie descriptions and content text
   * - @tailwindcss/aspect-ratio: Could optimize video player aspect ratio handling
   * - Custom plugins: Could be added for streaming-specific utilities like video overlay positioning
   *
   * Streaming Platform Context:
   * - Current components (MovieCard, Navbar, Billboard) work well with core Tailwind utilities
   * - Complex responsive layouts are handled through Tailwind's built-in responsive prefixes
   * - Animation and transition needs are met by Tailwind's default transition utilities
   *
   * @see {@link https://tailwindcss.com/docs/plugins} Plugins Documentation
   */
  plugins: [],
};
