export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      /* Mobile-First Critical CSS for above-the-fold content with Core Web Vitals optimization */
      
      /* Base Mobile Styles (320px+) */
      .hero-section {
        min-height: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        contain: layout style paint;
        will-change: contents;
        padding: 1rem 0;
      }
      
      .hero-content {
        position: relative;
        z-index: 10;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        contain: layout;
      }
      
      /* Mobile-First Typography */
      .hero-title {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        line-height: 1.1;
        margin-bottom: 1rem;
        text-shadow: 0 4px 8px rgba(0,0,0,0.4);
        background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        contain: layout;
      }
      
      .hero-subtitle {
        font-size: 1.125rem;
        color: rgba(255,255,255,0.95);
        margin-bottom: 1.5rem;
        max-width: 600px;
        line-height: 1.4;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      /* Mobile-First CTA Button - Touch Optimized */
      .cta-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        transform: translateZ(0);
        backface-visibility: hidden;
        will-change: transform, box-shadow;
        min-height: 48px; /* Touch target minimum */
        width: 100%;
        max-width: 280px;
      }
      
      .cta-button:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6);
      }
      
      .cta-button:active {
        transform: translateY(0) scale(0.98);
      }
      
      /* Mobile-First Social Proof Grid */
      .social-proof-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      
      .social-proof-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 1rem;
        padding: 1rem 0.75rem;
        text-align: center;
        color: white;
        transition: all 0.3s ease;
        will-change: transform;
        min-height: 80px; /* Consistent height */
      }
      
      .social-proof-card:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }
      
      /* Mobile-First Category Grid */
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
        contain: layout;
      }
      
      .category-card {
        background: white;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(229, 231, 235, 0.8);
        will-change: transform, box-shadow;
        contain: layout style;
        min-height: 200px; /* Consistent height */
      }
      
      .category-card:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08);
      }
      
      /* Mobile-First Product Grid */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
        contain: layout;
      }
      
      .product-card {
        background: white;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(243, 244, 246, 0.8);
        position: relative;
        will-change: transform, box-shadow;
        contain: layout style;
        min-height: 320px; /* Consistent height */
      }
      
      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08);
      }
      
      .product-image {
        aspect-ratio: 1;
        background: #f9fafb;
        position: relative;
        overflow: hidden;
        contain: layout;
      }
      
      .product-image img {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      
      .product-card:hover .product-image img {
        transform: scale(1.05);
      }
      
      /* Enhanced loading skeleton with better animation */
      .skeleton {
        background: linear-gradient(
          90deg,
          rgba(240, 240, 240, 0.8) 0%,
          rgba(224, 224, 224, 0.9) 50%,
          rgba(240, 240, 240, 0.8) 100%
        );
        background-size: 200% 100%;
        animation: loading 1.8s ease-in-out infinite;
        border-radius: 0.5rem;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Advanced performance optimizations */
      .will-change-transform {
        will-change: transform;
      }
      
      .content-visibility-auto {
        content-visibility: auto;
        contain-intrinsic-size: 0 400px;
      }
      
      /* GPU acceleration for smooth animations */
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Enhanced trust indicators */
      .trust-indicators {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
        margin-top: 1.5rem;
        opacity: 0.9;
        font-size: 0.875rem;
      }
      
      .trust-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.9);
        min-height: 32px; /* Touch target */
      }
      
      /* Tablet Styles (768px+) */
      @media (min-width: 768px) {
        .hero-section {
          min-height: 500px;
          padding: 2rem 0;
        }
        
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .cta-button {
          width: auto;
          padding: 1.25rem 2rem;
          font-size: 1.125rem;
        }
        
        .social-proof-grid {
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .social-proof-card {
          padding: 1.25rem 1rem;
        }
        
        .category-grid {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .product-grid {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .trust-indicators {
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
        }
      }
      
      /* Desktop Styles (1024px+) */
      @media (min-width: 1024px) {
        .hero-section {
          min-height: 600px;
        }
        
        .hero-title {
          font-size: 5rem;
        }
        
        .hero-subtitle {
          font-size: 2rem;
        }
        
        .cta-button {
          padding: 1.5rem 2.5rem;
        }
        
        .category-grid {
          gap: 2rem;
        }
        
        .product-grid {
          gap: 2rem;
        }
      }
      
      /* Large Desktop (1280px+) */
      @media (min-width: 1280px) {
        .hero-title {
          font-size: 7rem;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .category-card,
        .product-card {
          background: rgba(17, 24, 39, 0.8);
          border-color: rgba(75, 85, 99, 0.4);
          color: white;
        }
        
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(55, 65, 81, 0.8) 0%,
            rgba(75, 85, 99, 0.9) 50%,
            rgba(55, 65, 81, 0.8) 100%
          );
        }
      }
      
      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .category-card,
        .product-card,
        .cta-button,
        .social-proof-card {
          transition: none;
        }
        
        .skeleton {
          animation: none;
          background: #f0f0f0;
        }
        
        .product-image img {
          transition: none;
        }
        
        .product-card:hover .product-image img {
          transform: none;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .category-card,
        .product-card {
          border-width: 2px;
          border-color: #000;
        }
        
        .cta-button {
          border: 2px solid #000;
        }
      }
      
      /* Touch device optimizations */
      @media (hover: none) and (pointer: coarse) {
        .category-card:hover,
        .product-card:hover {
          transform: none;
        }
        
        .category-card:active,
        .product-card:active {
          transform: scale(0.98);
        }
        
        .cta-button:hover {
          transform: none;
        }
        
        .cta-button:active {
          transform: scale(0.95);
        }
      }
      
      /* Focus management for keyboard navigation */
      .category-card:focus-visible,
      .product-card:focus-visible,
      .cta-button:focus-visible {
        outline: 3px solid #3b82f6;
        outline-offset: 2px;
      }
      
      /* Print styles */
      @media print {
        .hero-section {
          background: none;
          color: black;
        }
        
        .cta-button {
          background: none;
          color: black;
          border: 2px solid black;
        }
      }
    `
    }} />
  );
} 