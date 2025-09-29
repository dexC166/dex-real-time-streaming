/**
 * Navigation Bar Component for DEX Real-Time Streaming Platform
 *
 * This is the primary navigation component that provides authenticated users with
 * comprehensive navigation controls, user account management, and responsive
 * design across all devices. It implements a Netflix-like navigation experience
 * with scroll-based background effects, mobile responsiveness, and seamless
 * integration with the platform's content discovery system.
 *
 * Key architectural decisions for the streaming platform:
 * - Fixed Positioning: Provides persistent navigation across all pages and scrolling
 * - Responsive Design: Adapts to desktop and mobile devices with different layouts
 * - Scroll Effects: Dynamic background appearance based on scroll position
 * - User Controls: Integrated search, notifications, and account management
 * - Netflix-Style Design: Familiar navigation patterns for streaming platform credibility
 *
 * The streaming platform relies on this component for:
 * - Navigation: Primary navigation interface for content discovery and browsing
 * - User Experience: Consistent navigation across all authenticated pages
 * - Account Management: User profile access, settings, and logout functionality
 * - Mobile Support: Responsive navigation for mobile and tablet devices
 *
 * @see {@link pages/browse.tsx} Main browsing page using this navigation
 * @see {@link components/NavbarItem.tsx} Individual navigation menu items
 * @see {@link components/MobileMenu.tsx} Mobile navigation dropdown menu
 * @see {@link components/AccountMenu.tsx} User account management dropdown
 * @see {@link pages/profiles.tsx} User profile management page
 * @see {@link pages/watch/[movieId].tsx} Video streaming page
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BsChevronDown, BsSearch, BsBell } from 'react-icons/bs';
import NavbarItem from './NavbarItem';
import MobileMenu from './MobileMenu';
import AccountMenu from './AccountMenu';

/**
 * Scroll Offset Threshold for Background Effect
 *
 * Defines the scroll position threshold in pixels where the navbar background
 * becomes visible. This creates a Netflix-like effect where the navbar
 * appears transparent initially and gains a background as users scroll.
 *
 * Why 66 pixels for the streaming platform:
 * - Visual Design: Provides enough scroll distance before background appears
 * - User Experience: Creates smooth transition from transparent to opaque
 * - Content Visibility: Ensures navbar doesn't interfere with billboard content
 * - Netflix Pattern: Matches industry-standard scroll behavior for streaming platforms
 *
 * Technical Implementation:
 * - Used in scroll event listener to determine when to show background
 * - Triggers CSS transition for smooth background appearance
 * - Balances content visibility with navigation accessibility
 */
const TOP_OFFSET = 66;

/**
 * Navigation Bar Component
 *
 * This component renders the complete navigation interface for the streaming
 * platform, providing responsive navigation controls, user account management,
 * and scroll-based visual effects. It's designed to deliver a Netflix-like
 * navigation experience with seamless integration across all authenticated pages.
 *
 * Why this component is essential for the streaming platform:
 * - Navigation: Primary navigation interface for content discovery and browsing
 * - User Experience: Consistent navigation across all authenticated pages
 * - Account Management: User profile access, settings, and logout functionality
 * - Mobile Support: Responsive navigation for mobile and tablet devices
 *
 * Component Architecture:
 * - Fixed Positioning: Persistent navigation across all pages and scrolling
 * - Responsive Design: Desktop and mobile layouts with appropriate controls
 * - Scroll Effects: Dynamic background appearance based on scroll position
 * - User Controls: Search, notifications, and account management integration
 * - Child Components: NavbarItem, MobileMenu, and AccountMenu for functionality
 *
 * Navigation Features:
 * - Logo: Platform branding and home navigation
 * - Desktop Menu: Full navigation items for large screens
 * - Mobile Menu: Collapsible navigation for mobile devices
 * - Search: Search functionality for content discovery
 * - Notifications: User notification system
 * - Account Menu: User profile and account management
 *
 * User Experience Flow:
 * 1. User sees transparent navbar on page load
 * 2. User scrolls down and navbar gains background for visibility
 * 3. User can navigate between different content sections
 * 4. User can access account settings and logout functionality
 * 5. User can search for content and manage notifications
 * 6. User experiences consistent navigation across all pages
 *
 * @returns JSX.Element - The complete navigation interface
 *
 * @example
 * ```typescript
 * // Usage in page components
 * import Navbar from '@/components/Navbar';
 *
 * export default function MyPage() {
 *   return (
 *     <>
 *       <Navbar />
 *       <div>Page content</div>
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link pages/browse.tsx} Main browsing page using this navigation
 * @see {@link components/NavbarItem.tsx} Individual navigation menu items
 * @see {@link components/MobileMenu.tsx} Mobile navigation dropdown menu
 * @see {@link components/AccountMenu.tsx} User account management dropdown
 */
const Navbar = () => {
  /**
   * Mobile Menu State Management
   *
   * Controls the visibility of the mobile navigation menu for responsive design.
   * This enables mobile users to access navigation items through a collapsible
   * dropdown menu when screen space is limited.
   *
   * Why mobile menu state is important for the streaming platform:
   * - Responsive Design: Enables navigation on mobile and tablet devices
   * - User Experience: Provides accessible navigation for all screen sizes
   * - Content Discovery: Ensures users can navigate content on any device
   * - Platform Accessibility: Makes the platform usable across all devices
   */
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  /**
   * Account Menu State Management
   *
   * Controls the visibility of the user account dropdown menu. This enables
   * users to access their profile, account settings, and logout functionality
   * through an intuitive dropdown interface.
   *
   * Why account menu state is essential for the streaming platform:
   * - User Management: Enables access to user profile and account settings
   * - Authentication: Provides logout functionality for user security
   * - User Experience: Creates intuitive account management interface
   * - Platform Integration: Connects navigation to user authentication system
   */
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  /**
   * Background Visibility State Management
   *
   * Controls the visibility of the navbar background based on scroll position.
   * This creates a Netflix-like effect where the navbar appears transparent
   * initially and gains a background as users scroll for better content visibility.
   *
   * Why background state is important for the streaming platform:
   * - Visual Design: Creates Netflix-like navigation experience
   * - Content Visibility: Ensures navbar doesn't interfere with billboard content
   * - User Experience: Provides smooth visual transitions during scrolling
   * - Platform Credibility: Matches industry-standard streaming platform behavior
   */
  const [showBackground, setShowBackground] = useState(false);

  /**
   * Scroll Event Handler for Background Effect
   *
   * Monitors scroll position to determine when to show the navbar background.
   * This creates a smooth transition effect that enhances the user experience
   * and ensures proper content visibility across all scroll positions.
   *
   * Why scroll handling is essential for the streaming platform:
   * - Visual Design: Creates Netflix-like navigation experience
   * - Content Visibility: Ensures navbar doesn't interfere with content
   * - User Experience: Provides smooth visual transitions during scrolling
   * - Platform Credibility: Matches industry-standard streaming platform behavior
   *
   * Implementation Details:
   * - Listens for scroll events on the window object
   * - Compares scroll position to TOP_OFFSET threshold
   * - Updates showBackground state for CSS transition effects
   * - Cleans up event listener on component unmount
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * Mobile Menu Toggle Function
   *
   * Toggles the visibility of the mobile navigation menu. This enables
   * mobile users to access navigation items through a collapsible dropdown
   * menu when screen space is limited.
   *
   * Why this function is essential for the streaming platform:
   * - Responsive Design: Enables navigation on mobile and tablet devices
   * - User Experience: Provides accessible navigation for all screen sizes
   * - Content Discovery: Ensures users can navigate content on any device
   * - Platform Accessibility: Makes the platform usable across all devices
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Toggles showMobileMenu state between true and false
   * - Enables smooth mobile navigation experience
   */
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  /**
   * Account Menu Toggle Function
   *
   * Toggles the visibility of the user account dropdown menu. This enables
   * users to access their profile, account settings, and logout functionality
   * through an intuitive dropdown interface.
   *
   * Why this function is essential for the streaming platform:
   * - User Management: Enables access to user profile and account settings
   * - Authentication: Provides logout functionality for user security
   * - User Experience: Creates intuitive account management interface
   * - Platform Integration: Connects navigation to user authentication system
   *
   * Implementation Details:
   * - Uses useCallback for performance optimization
   * - Toggles showAccountMenu state between true and false
   * - Enables smooth account management experience
   */
  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  return (
    <nav className="w-full fixed z-40">
      <div
        className={`
    px-4
    md:px-16
    py-6
    flex
    flex-row
    items-center
    transition
    duration-500
    ${showBackground ? 'bg-zinc- bg-opacity-90' : ''}
    `}
      >
        <img className="h-4 lg:h-7" src="/images/logo.png" alt="Logo" />
        <div
          className="
        flex-row
        ml-8
        gap-7
        hidden
        lg:flex"
        >
          <NavbarItem label="Home" />
          <NavbarItem label="Series" />
          <NavbarItem label="Films" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
          <NavbarItem label="Browse by Languages" />
        </div>
        <div
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-row item-center gap-2 ml-8 cursor-pointer relative"
        >
          <p className="text-white text-sm">Browse</p>
          <BsChevronDown
            className={`text-white transition ${
              showMobileMenu ? 'rotate-180' : 'rotate-0'
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>
        <div className="flex flex-row ml-auto gap-7 item-center">
          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsSearch />
          </div>
          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsBell />
          </div>

          <div
            onClick={toggleAccountMenu}
            className="flex flex-row items-center gap-2 cursor-pointer relative"
          >
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
              <img src="/images/default-blue.png" alt="" />
            </div>
            <BsChevronDown
              className={`text-white transition ${
                showAccountMenu ? 'rotate-180' : 'rotate-0'
              }`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
