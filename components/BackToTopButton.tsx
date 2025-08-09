'use client'; // This is a client component

import {
  useEffect,
  useState,
} from 'react';

// BackToTopButton component
// Displays a button that scrolls the user back to the top of the page when clicked.
// The button is visible only when the user has scrolled down past a certain threshold.
const BackToTopButton: React.FC = () => {
  // State to control the visibility of the button
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll the page smoothly to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

  // Effect to handle scroll events and update button visibility
  useEffect(() => {
    // Function to check scroll position and update state
    const toggleVisibility = () => {
      // If the user has scrolled down more than 300 pixels, show the button
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        // Otherwise, hide the button
        setIsVisible(false);
      }
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Empty dependency array means this effect runs only once on mount and cleans up on unmount

  // Render the button only if isVisible is true
  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          // Tailwind CSS classes for styling:
          // fixed: Position the button relative to the viewport
          // bottom-4 right-4: Position it 4 units from the bottom and right edges
          // bg-primary text-primary-foreground: Set background and text color using theme colors
          // p-3: Add padding
          // rounded-full: Make the button round
          // shadow-lg: Add a large shadow
          // hover:bg-primary/90: Darken background on hover
          // transition-opacity duration-300: Add a smooth transition for opacity changes
          // opacity-100 (when visible) / opacity-0 (when hidden - handled by conditional rendering): Control opacity
          // z-50: Ensure the button is above other content
          className='fixed bottom-40 right-6 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-opacity duration-300 hover:bg-primary/90'
          aria-label='Scroll to top' // Accessibility label
        >
          {/* SVG icon for an upward arrow */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 10l7-7m0 0l7 7m-7-7v18'
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
