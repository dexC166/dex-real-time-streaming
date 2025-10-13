/**
 * User Profile Selection Page for DEX Real-Time Streaming Platform
 *
 * This is the intermediate profile selection page that appears after successful
 * authentication, allowing users to choose their viewing profile before accessing
 * the main streaming platform. It implements a Netflix-like profile selection
 * interface with user personalization and seamless navigation to the main experience.
 *
 * Key architectural decisions for the streaming platform:
 * - Authentication Gateway: Acts as a bridge between authentication and main platform
 * - User Personalization: Displays user information for profile selection
 * - Netflix-Style Design: Familiar profile selection interface for user credibility
 * - Seamless Navigation: Provides smooth transition to main streaming experience
 *
 * The streaming platform relies on this page for:
 * - User Experience: Provides familiar Netflix-like profile selection interface
 * - Authentication Flow: Bridges successful authentication to main platform access
 * - User Personalization: Displays user information for profile confirmation
 * - Navigation: Enables smooth transition to the main streaming experience
 *
 * @see {@link pages/auth.tsx} Authentication page that redirects to this page
 * @see {@link pages/browse.tsx} Main streaming page after profile selection
 * @see {@link pages/index.tsx} Landing page with authentication flow
 * @see {@link hooks/useCurrentUser.ts} User data hook for profile information
 * @see {@link pages/api/current.ts} Current user API endpoint
 */

import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';

/**
 * Server-Side Props for Authentication Protection
 *
 * This function handles server-side authentication checking for the profiles page,
 * ensuring that only authenticated users can access the profile selection interface.
 * It redirects unauthenticated users back to the authentication page.
 *
 * Why this server-side protection is essential for the streaming platform:
 * - Security: Prevents unauthorized access to profile selection interface
 * - User Experience: Ensures only authenticated users see profile selection
 * - Authentication Flow: Maintains proper authentication state throughout the platform
 * - Performance: Server-side redirects are faster than client-side authentication checks
 *
 * Authentication Flow:
 * 1. Checks if user has valid session using NextAuth.js getSession
 * 2. If authenticated: Renders profile selection interface
 * 3. If not authenticated: Redirects to /auth for authentication
 * 4. Uses permanent: false for temporary redirects (better for user experience)
 *
 * Streaming Platform Integration:
 * - Authentication Page: Redirects unauthenticated users to /auth
 * - Profile Selection: Allows authenticated users to choose their viewing profile
 * - Main Platform: Provides gateway to /browse for full streaming access
 * - User Journey: Maintains authentication state throughout the platform
 *
 * @param context - Next.js server-side props context with request/response data
 * @returns Promise<{ props: {} } | { redirect: { destination: string; permanent: boolean } }>
 *
 * @example
 * ```typescript
 * // Authenticated user flow
 * // User completes auth → getServerSideProps checks session → renders profiles page
 *
 * // Unauthenticated user flow
 * // User visits /profiles → getServerSideProps checks session → redirects to /auth
 * ```
 *
 * @see {@link pages/auth.tsx} Authentication page for login/register
 * @see {@link pages/browse.tsx} Main streaming page after profile selection
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 */
export async function getServerSideProps(context: NextPageContext) {
  /**
   * Session Validation
   *
   * Uses NextAuth.js getSession to check if the user has a valid authentication
   * session. This is the core logic that determines whether to show the profile
   * selection interface or redirect to the authentication page.
   *
   * Why this check is crucial for the streaming platform:
   * - Security: Prevents unauthorized access to profile selection
   * - User Experience: Ensures only authenticated users see profile interface
   * - Authentication Flow: Maintains proper authentication state
   * - Performance: Server-side checks are faster than client-side authentication
   */
  const session = await getSession(context);

  /**
   * Unauthenticated User Redirect
   *
   * If the user doesn't have a valid session, redirects them to the authentication
   * page where they can log in or register. This ensures only authenticated users
   * can access the profile selection interface.
   *
   * Why redirect to /auth for unauthenticated users:
   * - Security: Prevents unauthorized access to profile selection
   * - User Experience: Guides users to authentication before profile selection
   * - Authentication Flow: Maintains proper authentication state
   * - Business Logic: Only authenticated users should see profile selection
   *
   * Redirect Configuration:
   * - destination: '/auth' - Authentication page for login/register
   * - permanent: false - Temporary redirect for better user experience
   */
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  /**
   * Authenticated User Profile Selection
   *
   * Returns empty props to render the profile selection interface for authenticated
   * users. This enables the profile selection flow and user personalization
   * for the streaming platform experience.
   *
   * Why empty props for authenticated users:
   * - Profile Selection: Shows profile selection interface for authenticated users
   * - User Personalization: Displays user information for profile confirmation
   * - Navigation: Enables smooth transition to main streaming platform
   * - User Experience: Provides familiar Netflix-like profile selection
   */
  return {
    props: {},
  };
}

/**
 * Profile Selection Component
 *
 * This component renders the profile selection interface for authenticated users,
 * displaying their profile information and providing navigation to the main
 * streaming platform. It's designed to provide a familiar Netflix-like
 * profile selection experience.
 *
 * Why this component is essential for the streaming platform:
 * - User Experience: Provides familiar Netflix-like profile selection interface
 * - Authentication Flow: Bridges successful authentication to main platform access
 * - User Personalization: Displays user information for profile confirmation
 * - Navigation: Enables smooth transition to the main streaming experience
 *
 * Component Features:
 * - User Profile Display: Shows user's name and profile information
 * - Netflix-Style Design: Familiar profile selection interface for credibility
 * - Responsive Design: Optimized for all devices and screen sizes
 * - Smooth Navigation: Seamless transition to main streaming platform
 *
 * User Experience Flow:
 * 1. User completes authentication (login/register/OAuth)
 * 2. User is redirected to this profile selection page
 * 3. User sees their profile information and confirmation
 * 4. User clicks on profile to access main streaming platform
 * 5. User is redirected to /browse for full streaming experience
 *
 * @returns JSX.Element - The complete profile selection interface
 *
 * @example
 * ```typescript
 * // User journey example
 * // 1. User completes authentication → redirects to /profiles
 * // 2. User sees profile selection with their name
 * // 3. User clicks profile → redirects to /browse
 * // 4. User gains access to full streaming platform
 * ```
 *
 * @see {@link pages/auth.tsx} Authentication page that redirects here
 * @see {@link pages/browse.tsx} Main streaming page after profile selection
 * @see {@link hooks/useCurrentUser.ts} User data hook for profile information
 * @see {@link pages/api/current.ts} Current user API endpoint
 */
const Profiles = () => {
  /**
   * Router for Navigation
   *
   * Next.js router instance for programmatic navigation to the main streaming
   * platform. This enables the profile selection page to redirect users to
   * the main browsing experience after profile selection.
   *
   * Why router is essential for the streaming platform:
   * - Navigation: Enables programmatic routing to main streaming platform
   * - User Experience: Provides smooth transition from profile selection to streaming
   * - Authentication Flow: Completes the authentication-to-streaming journey
   * - Platform Integration: Connects profile selection to main platform access
   */
  const router = useRouter();

  /**
   * Current User Data
   *
   * Fetches the current authenticated user's data using the useCurrentUser hook.
   * This provides user information for profile display and personalization
   * in the profile selection interface.
   *
   * Why user data is important for the streaming platform:
   * - User Personalization: Displays user's name and profile information
   * - Profile Confirmation: Shows user which profile they're selecting
   * - User Experience: Provides personalized profile selection interface
   * - Authentication: Confirms user is properly authenticated
   */
  const { data: user } = useCurrentUser();

  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">
          Who is watching?
        </h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div
            onClick={() => {
              router.push('/browse');
            }}
          >
            <div className="group flex-row w-44 mx-auto">
              <div
                className="
              w-44
              h-44
              rounded-md
              flex
              items-center
              justify-center
              border-2
              border-transparent
              group-hover:cursor-pointer
              group-hover:border-white
              overflow-hidden"
              >
                <img src="/images/default-blue.png" alt="Profile" />
              </div>

              <div
                className="
              mt-4
              text-gray-400
              text-2xl
              text-center
              group-hover:text-white"
              >
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
