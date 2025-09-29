/**
 * PostCSS Configuration for DEX Real-Time Streaming Platform
 *
 * This configuration file defines how PostCSS processes CSS during the build pipeline.
 * PostCSS acts as the CSS processing engine that transforms Tailwind CSS directives
 * and adds vendor prefixes for optimal browser compatibility in the streaming platform.
 *
 * Key architectural decisions reflected in this config:
 * - Tailwind CSS Integration: Processes @tailwind directives in globals.css to generate utility classes
 * - Autoprefixer Support: Automatically adds vendor prefixes for cross-browser compatibility
 * - Next.js Integration: Works seamlessly with Next.js 13.5.11's built-in CSS processing
 * - Performance Optimization: Ensures CSS is optimized for production builds
 *
 * The streaming platform relies on this configuration for:
 * - Responsive Design: Processing Tailwind's responsive utilities (sm:, md:, lg:) for video grids
 * - Dark Theme Support: Transforming @apply directives for zinc-900 dark backgrounds
 * - Browser Compatibility: Adding vendor prefixes for CSS Grid, Flexbox, and modern properties
 * - Production Optimization: Minifying and optimizing CSS for faster loading times
 *
 * @see {@link https://postcss.org/} PostCSS Documentation
 * @see {@link https://tailwindcss.com/docs/using-with-nextjs} Tailwind CSS with Next.js
 * @see {@link https://github.com/postcss/autoprefixer} Autoprefixer Documentation
 */
module.exports = {
  /**
   * PostCSS Plugins Configuration
   *
   * Defines the plugins that PostCSS will use to process CSS files. The order of plugins
   * is crucial for the streaming platform because:
   *
   * Plugin Processing Order:
   * 1. tailwindcss: Processes @tailwind directives first to generate utility classes
   * 2. autoprefixer: Adds vendor prefixes to the final CSS output
   *
   * Why this order matters for the streaming platform:
   * - Tailwind must run first to convert @tailwind base/components/utilities into actual CSS
   * - Autoprefixer must run last to add vendor prefixes to both Tailwind-generated CSS and custom CSS
   * - This ensures all CSS (including @apply directives in globals.css) gets proper vendor prefixes
   *
   * Streaming Platform Context:
   * - The platform uses @apply in globals.css for body styling (bg-zinc-900, h-full, overflow-x-hidden)
   * - Tailwind's responsive utilities need proper vendor prefixes for older browsers
   * - CSS Grid and Flexbox properties used in MovieCard and Navbar components require prefixes
   * - Modern CSS features like backdrop-filter and transform need vendor prefixes for Safari
   *
   * @see {@link https://postcss.org/docs/plugins} PostCSS Plugins Documentation
   */
  plugins: {
    /**
     * Tailwind CSS Plugin
     *
     * Processes Tailwind CSS directives and generates utility classes. This is essential
     * for the streaming platform because:
     *
     * What it does:
     * - Converts @tailwind base, @tailwind components, @tailwind utilities into actual CSS
     * - Processes @apply directives in custom CSS (like globals.css)
     * - Generates responsive utilities (sm:, md:, lg:) used throughout the streaming UI
     * - Applies the content configuration from tailwind.config.js to scan for used classes
     *
     * Streaming Platform Usage:
     * - Processes @tailwind directives in styles/globals.css
     * - Generates utility classes used in components like MovieCard, Navbar, and Billboard
     * - Handles responsive breakpoints for mobile-first video streaming interface
     * - Processes @apply directives for custom styling (body background, layout properties)
     *
     * Configuration:
     * - Uses empty object {} to apply default Tailwind configuration
     * - Automatically reads from tailwind.config.js for content paths and theme settings
     * - No custom configuration needed as the streaming platform uses default Tailwind features
     *
     * @see {@link https://tailwindcss.com/docs/installation#postcss} Tailwind CSS PostCSS Setup
     */
    tailwindcss: {},

    /**
     * Autoprefixer Plugin
     *
     * Automatically adds vendor prefixes to CSS properties for cross-browser compatibility.
     * This is crucial for the streaming platform because:
     *
     * What it does:
     * - Adds vendor prefixes (-webkit-, -moz-, -ms-) to CSS properties
     * - Uses browserlist configuration to determine which prefixes are needed
     * - Ensures consistent rendering across different browsers and devices
     * - Handles modern CSS features that need prefixes for older browsers
     *
     * Streaming Platform Benefits:
     * - Ensures video player controls work across all browsers
     * - Makes responsive grid layouts compatible with older mobile browsers
     * - Adds prefixes for CSS Grid and Flexbox used in MovieCard and Navbar components
     * - Handles modern properties like backdrop-filter for modal overlays
     *
     * Browser Support:
     * - Automatically detects which prefixes are needed based on project's browser targets
     * - Uses Next.js default browserlist configuration
     * - Ensures the streaming platform works on devices from mobile phones to smart TVs
     *
     * Configuration:
     * - Uses empty object {} to apply default autoprefixer settings
     * - Relies on browserlist configuration from package.json or .browserslistrc
     * - No custom configuration needed as Next.js provides sensible defaults
     *
     * @see {@link https://github.com/postcss/autoprefixer} Autoprefixer Documentation
     * @see {@link https://browserslist.dev/} Browserlist Configuration
     */
    autoprefixer: {},
  },
};
