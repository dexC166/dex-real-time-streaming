/**
 * Floating Label Input Component for DEX Real-Time Streaming Platform
 *
 * This is a sophisticated input component that implements floating label animations
 * and Netflix-style form styling for the streaming platform's authentication system.
 * It provides a polished, professional input experience with smooth label transitions,
 * proper accessibility, and consistent styling across all form contexts.
 *
 * Key architectural decisions for the streaming platform:
 * - Floating Label Animation: Smooth label transitions using CSS peer selectors
 * - Netflix-Style Design: Dark theme with neutral colors for streaming platform credibility
 * - Accessibility: Proper label association and focus management for screen readers
 * - Form Integration: Seamless integration with authentication and registration forms
 * - Responsive Design: Consistent appearance across all device sizes
 *
 * The streaming platform relies on this component for:
 * - User Authentication: Email and password inputs for login and registration
 * - Form Consistency: Standardized input styling across all platform forms
 * - User Experience: Professional, Netflix-like form interactions
 * - Accessibility: Proper form labeling and keyboard navigation support
 *
 * @see {@link pages/auth.tsx} Authentication page using this input component
 * @see {@link pages/index.tsx} Landing page with email input (native HTML)
 * @see {@link pages/api/register.ts} Registration API that processes input data
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration for form data
 */

import React from 'react';

/**
 * Input Component Props Interface
 *
 * Defines the TypeScript interface for the Input component props.
 * This ensures type safety and provides clear contracts for component usage
 * across all form contexts in the streaming platform.
 *
 * Why this interface is essential for the streaming platform:
 * - Type Safety: Ensures all inputs receive proper configuration and handlers
 * - API Contract: Provides clear interface for component usage
 * - Developer Experience: Enables IntelliSense and compile-time error checking
 * - Consistency: Standardizes input data structure across the platform
 *
 * @interface InputProps
 * @property {string} id - Unique identifier for the input field and label association
 * @property {Function} onChange - Event handler for input value changes
 * @property {string} value - Current input value for controlled component behavior
 * @property {string} label - Display label that animates with floating label effect
 * @property {string} [type] - Optional HTML input type (email, password, text, etc.)
 */
interface InputProps {
  /** Unique identifier for the input field and label association */
  id: string;
  /** Event handler for input value changes */
  onChange: any;
  /** Current input value for controlled component behavior */
  value: string;
  /** Display label that animates with floating label effect */
  label: string;
  /** Optional HTML input type (email, password, text, etc.) */
  type?: string;
}

/**
 * Floating Label Input Component
 *
 * This component renders a sophisticated input field with floating label animation
 * and Netflix-style dark theme styling. It's designed to provide a professional,
 * accessible form input experience that matches the streaming platform's design
 * language and user experience standards.
 *
 * Why this component is essential for the streaming platform:
 * - User Authentication: Email and password inputs for login and registration
 * - Form Consistency: Standardized input styling across all platform forms
 * - User Experience: Professional, Netflix-like form interactions
 * - Accessibility: Proper form labeling and keyboard navigation support
 *
 * Component Features:
 * - Floating Label Animation: Smooth label transitions using CSS peer selectors
 * - Netflix-Style Design: Dark theme with neutral colors for platform credibility
 * - Accessibility: Proper label association and focus management
 * - Form Integration: Seamless integration with authentication forms
 * - Responsive Design: Consistent appearance across all device sizes
 *
 * Floating Label Animation Strategy:
 * - Initial State: Label positioned inside input field at normal size
 * - Focus State: Label moves up and scales down when input is focused
 * - Filled State: Label stays in up position when input has value
 * - Smooth Transitions: CSS transitions provide polished animation effects
 *
 * CSS Peer Selector Implementation:
 * - peer: Applied to input element for label state control
 * - peer-placeholder-shown: Label returns to input when placeholder is shown
 * - peer-focus: Label animates up when input is focused
 * - Duration and transform classes provide smooth animation timing
 *
 * Accessibility Features:
 * - Proper label association with htmlFor and id attributes
 * - Screen reader support with semantic label elements
 * - Keyboard navigation support with focus management
 * - Form validation integration with invalid state styling
 *
 * Usage Contexts:
 * - Authentication Forms: Email and password inputs for login/registration
 * - User Registration: Username, email, and password fields
 * - Profile Management: User information input fields
 * - Any Form: Reusable input component for consistent styling
 *
 * @param props - Component props containing the input configuration
 * @param props.id - Unique identifier for the input field and label association
 * @param props.onChange - Event handler for input value changes
 * @param props.value - Current input value for controlled component behavior
 * @param props.label - Display label that animates with floating label effect
 * @param props.type - Optional HTML input type (email, password, text, etc.)
 * @returns JSX.Element - The rendered floating label input field
 *
 * @example
 * ```typescript
 * // Basic usage in authentication form
 * const [email, setEmail] = useState('');
 *
 * return (
 *   <Input
 *     id="email"
 *     label="Email"
 *     type="email"
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage in registration form
 * const [password, setPassword] = useState('');
 *
 * return (
 *   <Input
 *     id="password"
 *     label="Password"
 *     type="password"
 *     value={password}
 *     onChange={(e) => setPassword(e.target.value)}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Usage with username field
 * const [name, setName] = useState('');
 *
 * return (
 *   <Input
 *     id="name"
 *     label="Username"
 *     value={name}
 *     onChange={(e) => setName(e.target.value)}
 *   />
 * );
 * ```
 *
 * @see {@link pages/auth.tsx} Authentication page using this input component
 * @see {@link pages/index.tsx} Landing page with email input (native HTML)
 * @see {@link pages/api/register.ts} Registration API that processes input data
 * @see {@link pages/api/auth/[...nextauth].ts} NextAuth.js configuration for form data
 */
const Input: React.FC<InputProps> = ({ id, onChange, value, label, type }) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        className="
        block
        rounded-md
        px-6
        pt-6
        pb-1
        w-full
        text-md
      text-white
      bg-neutral-700
        appearance-none
        focus:outline-none
        focus:ring-0
        peer
        invalid:border-b-1
        "
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="
        absolute 
        text-md
      text-zinc-400
        duration-150 
        transform 
        -translate-y-3 
        scale-75 
        top-4 
        z-10 
        origin-[0] 
        left-6
        peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 
        peer-focus:scale-75
        peer-focus:-translate-y-3
      "
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
