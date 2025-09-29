/**
 * Landing Page for DEX Real-Time Streaming Platform
 *
 * This is the public-facing landing page that serves as the entry point for
 * new users to discover and join the streaming platform. It implements a
 * Netflix-like design with authentication-based routing, user acquisition
 * features, and comprehensive platform showcase sections.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication-Based Routing: Redirects authenticated users to browse page
 * - User Acquisition Focus: Optimized for converting visitors to registered users
 * - Netflix-Style Design: Familiar UI patterns for streaming platform credibility
 * - Progressive Enhancement: Works across all devices with responsive design
 *
 * The streaming platform relies on this page for:
 * - User Onboarding: First impression and conversion funnel for new users
 * - Authentication Flow: Seamless transition from landing to authentication
 * - Platform Showcase: Demonstrates streaming capabilities and features
 * - User Experience: Provides familiar Netflix-like interface for credibility
 *
 * @see {@link pages/auth.tsx} Authentication page with login/register forms
 * @see {@link pages/browse.tsx} Main browsing page for authenticated users
 * @see {@link pages/profiles.tsx} User profile management page
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js authentication configuration
 * @see {@link pages/api/register.ts} User registration API endpoint
 */

import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';

/**
 * Server-Side Props for Authentication-Based Routing
 *
 * This function handles server-side authentication checking and routing logic
 * for the landing page. It ensures that authenticated users are automatically
 * redirected to the main browsing experience while unauthenticated users see
 * the landing page for user acquisition.
 *
 * Why this server-side approach is essential for the streaming platform:
 * - User Experience: Prevents authenticated users from seeing landing page unnecessarily
 * - Performance: Server-side redirects are faster than client-side routing
 * - SEO: Proper HTTP redirects for search engine optimization
 * - Security: Prevents client-side authentication bypass attempts
 *
 * Authentication Flow:
 * 1. Checks if user has valid session using NextAuth.js getSession
 * 2. If authenticated: Redirects to /browse for main streaming experience
 * 3. If not authenticated: Renders landing page for user acquisition
 * 4. Uses permanent: false for temporary redirects (better for user experience)
 *
 * Streaming Platform Integration:
 * - Browse Page: Main destination for authenticated users with full streaming access
 * - Landing Page: User acquisition and platform showcase for new visitors
 * - Authentication: Seamless integration with NextAuth.js session management
 * - User Journey: Optimized flow from discovery to registration to streaming
 *
 * @param context - Next.js server-side props context with request/response data
 * @returns Promise<{ props: {} } | { redirect: { destination: string; permanent: boolean } }>
 *
 * @example
 * ```typescript
 * // Authenticated user flow
 * // User visits / → getServerSideProps checks session → redirects to /browse
 *
 * // Unauthenticated user flow
 * // User visits / → getServerSideProps checks session → renders landing page
 * ```
 *
 * @see {@link pages/browse.tsx} Main browsing page for authenticated users
 * @see {@link pages/auth.tsx} Authentication page for login/register
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  /**
   * Session Validation
   *
   * Uses NextAuth.js getSession to check if the user has a valid authentication
   * session. This is the core logic that determines whether to show the landing
   * page or redirect to the main streaming experience.
   *
   * Why this check is crucial for the streaming platform:
   * - User Experience: Prevents authenticated users from seeing marketing content
   * - Conversion: Ensures new users see the landing page for user acquisition
   * - Performance: Server-side checks are faster than client-side authentication
   * - Security: Validates authentication state before rendering content
   */
  const session = await getSession(context);

  /**
   * Authenticated User Redirect
   *
   * If the user has a valid session, redirects them to the main browsing page
   * where they can access the full streaming platform experience. This ensures
   * authenticated users don't see the landing page unnecessarily.
   *
   * Why redirect to /browse for authenticated users:
   * - User Experience: Takes users directly to the main streaming interface
   * - Conversion: Prevents authenticated users from seeing marketing content
   * - Performance: Avoids unnecessary landing page rendering for logged-in users
   * - Business Logic: Authenticated users should access the full platform
   *
   * Redirect Configuration:
   * - destination: '/browse' - Main streaming page with movie catalog
   * - permanent: false - Temporary redirect for better user experience
   */
  if (session) {
    return {
      redirect: {
        destination: '/browse',
        permanent: false,
      },
    };
  }

  /**
   * Unauthenticated User Landing Page
   *
   * Returns empty props to render the landing page for unauthenticated users.
   * This enables the user acquisition flow and platform showcase for new visitors.
   *
   * Why empty props for unauthenticated users:
   * - User Acquisition: Shows landing page to convert visitors to users
   * - Platform Showcase: Demonstrates streaming capabilities and features
   * - Marketing: Provides compelling content to encourage registration
   * - Conversion: Optimizes the user journey from discovery to registration
   */
  return { props: {} };
}

/**
 * Landing Page Component
 *
 * This component renders the public-facing landing page for the streaming platform,
 * featuring a Netflix-like design with hero section, platform showcase, and user
 * acquisition features. It's optimized for converting visitors into registered users.
 *
 * Why this component is essential for the streaming platform:
 * - User Acquisition: Primary conversion funnel for new user registration
 * - Platform Showcase: Demonstrates streaming capabilities and features
 * - Brand Experience: Provides professional, Netflix-like interface for credibility
 * - User Journey: Guides visitors from discovery to authentication to streaming
 *
 * Component Features:
 * - Hero Section: Compelling call-to-action with email capture
 * - Platform Showcase: Demonstrates streaming capabilities across devices
 * - Responsive Design: Optimized for all screen sizes and devices
 * - Authentication Integration: Seamless flow to login/register pages
 *
 * User Experience Flow:
 * 1. Visitor lands on page and sees compelling hero section
 * 2. User enters email and clicks "Get Started" for registration
 * 3. Redirects to /auth?variant=register with pre-filled email
 * 4. User completes registration and gains access to streaming platform
 *
 * @returns JSX.Element - The complete landing page with hero and showcase sections
 *
 * @example
 * ```typescript
 * // User journey example
 * // 1. User visits / → sees landing page
 * // 2. User enters email → clicks "Get Started"
 * // 3. Redirects to /auth?variant=register&email=user@example.com
 * // 4. User completes registration → gains access to /browse
 * ```
 *
 * @see {@link pages/auth.tsx} Authentication page with pre-filled email
 * @see {@link pages/browse.tsx} Main streaming page after authentication
 * @see {@link pages/profiles.tsx} User profile management
 */
export default function LandingPage() {
  /**
   * Email State Management
   *
   * Manages the email input state for the user acquisition form. This enables
   * pre-filling the email in the authentication page for better user experience.
   *
   * Why email state is important for the streaming platform:
   * - User Experience: Pre-fills email in registration form for convenience
   * - Conversion: Reduces friction in the registration process
   * - Data Collection: Captures user email for marketing and communication
   * - Authentication: Enables seamless transition to registration flow
   */
  const [email, setEmail] = useState('');

  /**
   * Router for Navigation
   *
   * Next.js router instance for programmatic navigation to authentication pages.
   * This enables seamless transitions from landing page to registration/login.
   *
   * Why router is essential for the streaming platform:
   * - Navigation: Enables programmatic routing to authentication pages
   * - User Experience: Provides smooth transitions between pages
   * - State Management: Allows passing data between pages via URL parameters
   * - Authentication Flow: Integrates with the platform's authentication system
   */
  const router = useRouter();

  /**
   * Get Started Handler
   *
   * Handles the "Get Started" button click, redirecting users to the registration
   * page with their email pre-filled. This creates a seamless user acquisition flow
   * from landing page to authentication.
   *
   * Why this function is crucial for the streaming platform:
   * - User Acquisition: Converts landing page visitors to registration attempts
   * - User Experience: Pre-fills email to reduce registration friction
   * - Conversion: Optimizes the user journey from discovery to registration
   * - Data Flow: Passes user input to the authentication system
   *
   * Function Behavior:
   * 1. Encodes the email input for safe URL parameter passing
   * 2. Navigates to /auth?variant=register with email parameter
   * 3. Enables pre-filling of email in the registration form
   * 4. Provides smooth transition from landing to authentication
   *
   * @example
   * ```typescript
   * // User enters "user@example.com" and clicks "Get Started"
   * // handleGetStarted() redirects to:
   * // /auth?variant=register&email=user%40example.com
   * ```
   *
   * @see {@link pages/auth.tsx} Authentication page that receives the email parameter
   * @see {@link pages/api/register.ts} Registration API that processes the email
   */
  const handleGetStarted = () => {
    router.push(`/auth?variant=register&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full bg-black text-white">
      {/* HERO SECTION - occupies 70vh */}
      <div
        className="w-full relative bg-[url('/images/hero.png')] bg-cover bg-center"
        style={{ height: '70vh' }}
      >
        {/* Dark overlay - increased opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col px-4">
          {/* Header with Logo & Sign In */}
          <div className="w-full flex items-center justify-between pt-6">
            <img
              src="/images/logo.png"
              alt="Dex-Streaming"
              className="w-32 md:w-44"
            />
            <button
              onClick={() => router.push('/auth?variant=login')}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 text-sm font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Hero Text - Centered in middle of screen */}
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold max-w-3xl">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-white text-xl md:text-2xl mt-4">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-white text-lg mt-5">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>

            {/* Email Input & Get Started Button */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 w-full rounded bg-black bg-opacity-60 text-white border border-gray-600"
              />
              <button
                onClick={handleGetStarted}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded text-xl font-medium whitespace-nowrap"
              >
                Get Started <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Border that separates hero and scrolling section - full width */}
      <div className="w-full border-t-8 border-gray-800"></div>

      {/* SCROLLABLE CONTENT SECTIONS */}
      <main className="w-full bg-black text-white">
        {/* Section: Enjoy on your TV */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Enjoy on your TV
              </h2>
              <p className="text-lg md:text-xl">
                Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
                Blu-ray players, and more.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              {/* TV frame image with relative positioning */}
              <div className="relative w-full max-w-md">
                <img
                  src="/images/tv.png"
                  alt="TV"
                  width={500}
                  height={300}
                  className="w-full h-auto relative z-10"
                />
                {/* Further adjusted video positioning to eliminate bottom black bar */}
                <div className="absolute top-[11%] left-[13%] w-[74%] h-[67%] z-0 overflow-hidden">
                  <video
                    src="/images/raw.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-center brightness-[80%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Download your shows */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Download your shows to watch offline
              </h2>
              <p className="text-lg md:text-xl">
                Save your favorites easily and always have something to watch.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative max-w-md">
                <img
                  src="/images/stranger-things-lg.jpg"
                  alt="Stranger Things phone"
                  className="w-full h-auto"
                />
                <div className="absolute flex items-center gap-2 bottom-6 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 p-2 rounded-lg border border-gray-600 w-3/4 max-w-xs">
                  <img
                    src="/images/stranger-things-sm.png"
                    alt="Poster"
                    className="w-12 h-16 object-cover"
                  />
                  <div className="flex flex-col text-white flex-grow">
                    <p className="text-sm font-bold">Stranger Things</p>
                    <p className="text-blue-400 text-xs">Downloading...</p>
                  </div>
                  <img
                    src="/images/download-icon.gif"
                    alt="Loading"
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Watch everywhere */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Watch everywhere
              </h2>
              <p className="text-lg md:text-xl">
                Stream unlimited movies and TV shows on your phone, tablet,
                laptop, and TV.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Device pile with relative positioning */}
              <div className="relative w-full max-w-md">
                <img
                  src="/images/device-pile.png"
                  alt="Devices"
                  className="w-full h-auto relative z-10"
                />
                {/* Video overlay inside device screen */}
                <div className="absolute top-[10%] left-[17%] w-[65%] h-[47%] z-0 overflow-hidden">
                  <video
                    src="/images/interstellar.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover brightness-[100%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Create profiles for kids */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Create profiles for kids
              </h2>
              <p className="text-lg md:text-xl">
                Send kids on adventures with their favorite characters in a
                space made just for them, free with your membership.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md">
                <img
                  src="/images/kids.png"
                  alt="Kids"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
