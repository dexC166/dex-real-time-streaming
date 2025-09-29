/**
 * Authentication Page for DEX Real-Time Streaming Platform
 *
 * This is the central authentication page that handles user login and registration
 * for the streaming platform. It provides a unified interface for both authentication
 * methods (credentials and OAuth) with seamless switching between login and register
 * modes, optimized for the Netflix-like user experience.
 *
 * Key architectural decisions for the streaming platform:
 * - Multi-Method Authentication: Supports credentials, Google OAuth, and GitHub OAuth
 * - Dynamic UI Switching: Seamlessly toggles between login and registration forms
 * - URL Parameter Integration: Pre-fills email from landing page redirects
 * - Netflix-Style Design: Familiar UI patterns for streaming platform credibility
 *
 * The streaming platform relies on this page for:
 * - User Authentication: Primary entry point for user login and registration
 * - OAuth Integration: Seamless social login with Google and GitHub
 * - User Onboarding: Converts landing page visitors to registered users
 * - Authentication Flow: Bridges landing page to main streaming experience
 *
 * @see {@link pages/index.tsx} Landing page that redirects to this page
 * @see {@link pages/profiles.tsx} User profile selection after authentication
 * @see {@link pages/browse.tsx} Main streaming page after profile selection
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 * @see {@link pages/api/register.ts} User registration API endpoint
 */

import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Input from '@/components/input';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

/**
 * Authentication Component
 *
 * This component renders the unified authentication interface for the streaming
 * platform, supporting both login and registration flows with multiple
 * authentication methods. It's designed to provide a seamless user experience
 * from landing page to authenticated streaming access.
 *
 * Why this component is essential for the streaming platform:
 * - User Onboarding: Primary conversion point from landing page to registered users
 * - Multi-Method Auth: Supports credentials, Google OAuth, and GitHub OAuth
 * - User Experience: Provides familiar Netflix-like authentication interface
 * - Authentication Flow: Bridges the gap between discovery and streaming access
 *
 * Component Features:
 * - Dynamic Form Switching: Seamlessly toggles between login and registration
 * - URL Parameter Integration: Pre-fills email from landing page redirects
 * - OAuth Integration: One-click social login with Google and GitHub
 * - Responsive Design: Optimized for all devices and screen sizes
 * - Keyboard Support: Enter key submission for better accessibility
 *
 * Authentication Flow:
 * 1. User arrives from landing page with pre-filled email (optional)
 * 2. User chooses between login or registration mode
 * 3. User authenticates via credentials or OAuth providers
 * 4. Successful authentication redirects to profiles page
 * 5. User selects profile and gains access to streaming platform
 *
 * @returns JSX.Element - The complete authentication interface with login/register forms
 *
 * @example
 * ```typescript
 * // URL parameters from landing page
 * // /auth?variant=register&email=user@example.com
 * // Pre-fills email and sets to registration mode
 *
 * // OAuth authentication
 * // User clicks Google/GitHub → NextAuth.js handles OAuth flow
 * // Successful auth → redirects to /profiles
 * ```
 *
 * @see {@link pages/index.tsx} Landing page with authentication redirects
 * @see {@link pages/profiles.tsx} User profile selection after authentication
 * @see {@link pages/browse.tsx} Main streaming page after profile selection
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration
 * @see {@link pages/api/register.ts} User registration API endpoint
 */
const Auth = () => {
  /**
   * Router for Navigation and URL Parameters
   *
   * Next.js router instance for programmatic navigation and URL parameter access.
   * This enables the authentication page to respond to URL parameters from the
   * landing page and handle navigation after successful authentication.
   *
   * Why router is essential for the streaming platform:
   * - URL Parameter Access: Reads email and variant from landing page redirects
   * - Navigation: Handles programmatic routing after authentication
   * - User Experience: Enables seamless flow from landing to authentication
   * - State Management: Allows passing data between pages via URL parameters
   */
  const router = useRouter();

  /**
   * Email State Management
   *
   * Manages the email input state for both login and registration forms.
   * This state can be pre-filled from URL parameters when users arrive
   * from the landing page, improving the user experience.
   *
   * Why email state is important for the streaming platform:
   * - User Experience: Pre-fills email from landing page for convenience
   * - Conversion: Reduces friction in the authentication process
   * - Data Consistency: Ensures email is available for both login and registration
   * - Authentication: Required for both credentials and OAuth flows
   */
  const [email, setEmail] = useState('');

  /**
   * Name State Management
   *
   * Manages the username input state for registration forms only.
   * This field is only shown during registration and is required for
   * creating new user accounts in the streaming platform.
   *
   * Why name state is important for the streaming platform:
   * - User Registration: Required for creating new user accounts
   * - User Experience: Provides personalized experience with display names
   * - Data Collection: Captures user information for platform personalization
   * - Authentication: Required for credentials-based registration
   */
  const [name, setName] = useState('');

  /**
   * Password State Management
   *
   * Manages the password input state for both login and registration forms.
   * This field is required for credentials-based authentication and is
   * securely handled through NextAuth.js and bcrypt hashing.
   *
   * Why password state is important for the streaming platform:
   * - Security: Required for credentials-based authentication
   * - User Experience: Enables secure login and registration
   * - Authentication: Powers the credentials provider in NextAuth.js
   * - Data Protection: Handled securely through NextAuth.js and bcrypt
   */
  const [password, setPassword] = useState('');

  /**
   * Authentication Variant State
   *
   * Manages whether the form is in 'login' or 'register' mode. This state
   * controls the form fields displayed, button text, and authentication
   * behavior, providing a unified interface for both authentication flows.
   *
   * Why variant state is essential for the streaming platform:
   * - User Experience: Provides unified interface for login and registration
   * - Form Management: Controls which fields are displayed and required
   * - Authentication Flow: Determines which authentication method to use
   * - UI Consistency: Maintains consistent design across both modes
   */
  const [variant, setVariant] = useState('login');

  /**
   * URL Parameter Processing Effect
   *
   * Processes URL parameters from the landing page to pre-fill form data
   * and set the appropriate authentication mode. This enables seamless
   * transitions from the landing page to the authentication page.
   *
   * Why this effect is crucial for the streaming platform:
   * - User Experience: Pre-fills email from landing page for convenience
   * - Conversion: Reduces friction in the authentication process
   * - Flow Integration: Seamlessly connects landing page to authentication
   * - Data Persistence: Maintains user input across page transitions
   *
   * URL Parameter Processing:
   * - email: Pre-fills the email input field
   * - variant: Sets the form to 'login' or 'register' mode
   * - Enables smooth user journey from landing to authentication
   */
  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
    if (router.query.variant === 'register') {
      setVariant('register');
    }
    if (router.query.variant === 'login') {
      setVariant('login');
    }
  }, [router.query]);

  /**
   * Authentication Variant Toggle
   *
   * Toggles between login and registration modes, updating the form
   * fields, button text, and authentication behavior. This provides
   * a seamless way for users to switch between authentication flows.
   *
   * Why this function is essential for the streaming platform:
   * - User Experience: Allows easy switching between login and registration
   * - Form Management: Updates form fields and validation based on mode
   * - UI Consistency: Maintains consistent design across both modes
   * - Conversion: Helps users find the right authentication flow
   *
   * Function Behavior:
   * - Toggles between 'login' and 'register' modes
   * - Updates form fields and button text accordingly
   * - Maintains form state during mode switching
   * - Provides smooth user experience
   */
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === 'login' ? 'register' : 'login'
    );
  }, []);

  /**
   * Credentials Login Handler
   *
   * Handles user login using email and password credentials through NextAuth.js.
   * This function authenticates users against the database and creates a
   * secure session for access to the streaming platform.
   *
   * Why this function is crucial for the streaming platform:
   * - User Authentication: Enables secure login with email and password
   * - Session Management: Creates authenticated sessions for platform access
   * - Security: Uses NextAuth.js for secure credential validation
   * - User Experience: Provides familiar login experience
   *
   * Authentication Flow:
   * 1. Validates email and password through NextAuth.js credentials provider
   * 2. NextAuth.js checks credentials against database using bcrypt
   * 3. Creates secure JWT session for authenticated user
   * 4. Redirects to profiles page for user profile selection
   *
   * @example
   * ```typescript
   * // User enters email and password
   * // login() calls NextAuth.js signIn with credentials
   * // Successful auth → redirects to /profiles
   * ```
   *
   * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js credentials provider
   * @see {@link pages/profiles.tsx} User profile selection after login
   */
  const login = useCallback(async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/profiles',
      });
    } catch (error) {
      // Error handling - consider implementing proper error logging
    }
  }, [email, password]);

  /**
   * User Registration Handler
   *
   * Handles user registration by creating a new account in the database
   * and then automatically logging the user in. This provides a seamless
   * registration experience that immediately grants access to the platform.
   *
   * Why this function is essential for the streaming platform:
   * - User Onboarding: Enables new user registration and account creation
   * - User Experience: Provides seamless registration-to-login flow
   * - Data Security: Uses secure password hashing through bcrypt
   * - Conversion: Immediately grants access after successful registration
   *
   * Registration Flow:
   * 1. Sends registration data to /api/register endpoint
   * 2. API creates new user account with bcrypt-hashed password
   * 3. Automatically calls login() to authenticate the new user
   * 4. Redirects to profiles page for user profile selection
   *
   * @example
   * ```typescript
   * // User enters name, email, and password
   * // register() calls /api/register to create account
   * // Successful registration → automatically calls login()
   * // User gains immediate access to streaming platform
   * ```
   *
   * @see {@link pages/api/register.ts} User registration API endpoint
   * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js credentials provider
   * @see {@link pages/profiles.tsx} User profile selection after registration
   */
  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        name,
        password,
      });

      login();
    } catch (error) {
      // Error handling - consider implementing proper error logging
    }
  }, [email, name, password, login]);

  /**
   * Keyboard Event Handler
   *
   * Handles Enter key presses to submit the authentication form,
   * providing better accessibility and user experience for form
   * submission without requiring mouse interaction.
   *
   * Why this function is important for the streaming platform:
   * - Accessibility: Enables keyboard-only form submission
   * - User Experience: Provides familiar form interaction patterns
   * - Efficiency: Allows quick form submission without mouse interaction
   * - Usability: Improves overall form usability and accessibility
   *
   * Function Behavior:
   * - Listens for Enter key presses on the form container
   * - Calls appropriate authentication function based on current variant
   * - Provides consistent behavior across login and registration modes
   * - Enhances form accessibility and user experience
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      variant === 'login' ? login() : register();
    }
  };

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.png')] bg-no-repeat bg-center bg-fixed bg-cover ">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div onKeyDown={handleKeyDown} className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  label="Username"
                  onChange={(ev: any) => {
                    setName(ev.target.value);
                  }}
                  id="name"
                  value={name}
                />
              )}
              <Input
                label="Email"
                onChange={(ev: any) => {
                  setEmail(ev.target.value);
                }}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(ev: any) => {
                  setPassword(ev.target.value);
                }}
                id="password"
                type="password"
                value={password}
              />
            </div>
            <button
              type="submit"
              onClick={variant === 'login' ? login : register}
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
            >
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div
                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                className="
                w-10
                h-10
                bg-white
                rounded-full
                flex
                items-center
                justify-center
                cursor-pointer
                hover:opacity-80
                transition"
              >
                <FcGoogle size={30} />
              </div>
              <div
                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                className="
                w-10
                h-10
                bg-white
                rounded-full
                flex
                items-center
                justify-center
                cursor-pointer
                hover:opacity-80
                transition"
              >
                <FaGithub size={30} />
              </div>
            </div>
            <p className="text-neutral-500 mt-12">
              {variant === 'login'
                ? 'First time using Dex-Streaming?'
                : 'Already have an account?'}
              <span
                onClick={toggleVariant}
                className="text-white ml-1 hover:underline cursor-pointer"
              >
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
