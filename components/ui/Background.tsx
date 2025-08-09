import React from 'react';
import clsx from 'clsx';

/**
 * Background - A fully customizable, reusable background wrapper for any page/section.
 *
 * @param backgroundStyle Optional preset background style: 'usersBlue', 'productsGreen', 'analyticsPurple', 'commerceIndigo', 'suppliersTeal'.
 *   - usersBlue: Soft blue radial + blue accent (user/auth flows)
 *   - productsGreen: Soft green radial + green accent (products/inventory)
 *   - analyticsPurple: Soft purple radial + purple accent (analytics/reports)
 *   - commerceIndigo: Soft indigo radial + indigo accent (commerce/orders)
 *   - suppliersTeal: Soft teal radial + teal accent (suppliers/partners)
 * @param patternStyle Optional overlay pattern: 'none', 'classicGrid', 'dots', 'diagonalLines', 'vignette', 'blobs', 'sparks', 'wavyChaos', 'rotatingShapes', 'isometricMotif'.
 *   - none: No overlay
 *   - classicGrid: Subtle square grid (default)
 *   - dots: Soft dot pattern
 *   - diagonalLines: Diagonal lines
 *   - vignette: Soft vignette/dark edges
 *   - blobs: Blurred color blobs (modern, premium)
 *   - sparks: Animated SVG lines and glowing dots (modern, premium)
 *   - wavyChaos: Wavy, chaotic pattern
 *   - rotatingShapes: Rotating shapes pattern
 *   - isometricMotif: Isometric motif pattern
 * @param showGrid Deprecated, use patternStyle instead
 * @param showRadial Toggle the radial gradient (default: true)
 * @param showAccent Toggle the accent overlay (default: true)
 * @param radialColor Tailwind bg-gradient for radial (default: theme)
 * @param accentColor Tailwind bg-gradient for accent (default: theme)
 * @param minHeight Minimum height for the background (default: 100vh-64px)
 * @param centerContent Center children vertically/horizontally (default: true)
 * @param padding Padding classes for outer container (default: p-4)
 * @param className Extra classes for outer div
 * @param title Optional title to render at the top of the content area
 * @param children Content to render inside
 * @param patternOpacity Opacity for the overlay pattern (0 to 1, default 0.6). Applies to any patternStyle.
 * @param patternAnimation Enable smooth animation for the pattern overlay (default: false). Only applies to 'blobs' and 'sparks' for now.
 * @param performanceMode If true, render static, minimal background for best performance
 */
interface BackgroundProps {
    backgroundStyle?: 'default' | 'usersBlue' | 'productsGreen' | 'analyticsPurple' | 'commerceIndigo' | 'suppliersTeal';
    patternStyle?: 'none' | 'classicGrid' | 'dots' | 'diagonalLines' | 'vignette' | 'blobs' | 'sparks' | 'animate-wavyChaos' | 'animate-rotatingShapes' | 'animate-isometricMotif';
    patternOpacity?: number;
    patternAnimation?: boolean;
    performanceMode?: boolean;
    showGrid?: boolean;
    showRadial?: boolean;
    showAccent?: boolean;
    radialColor?: string;
    accentColor?: string;
    minHeight?: string;
    centerContent?: boolean;
    padding?: string;
    className?: string;
    title?: React.ReactNode;
    children: React.ReactNode;
}

const BG_PRESETS = {
    default: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,theme(colors.primary.DEFAULT)_0%,theme(colors.secondary.DEFAULT)_60%,transparent_100%)]',
        accentColor: 'bg-[linear-gradient(135deg,theme(colors.accent.DEFAULT)_0%,transparent_80%)]',
    },
    usersBlue: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-users-soft))_0%,transparent_80%)]',
        accentColor: 'bg-[linear-gradient(135deg,hsl(var(--feature-users))_0%,transparent_80%)]',
    },
    productsGreen: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-products-soft))_0%,transparent_80%)]',
        accentColor: 'bg-[linear-gradient(135deg,hsl(var(--feature-products))_0%,transparent_80%)]',
    },
    analyticsPurple: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-analytics-soft))_0%,transparent_80%)]',
        accentColor: 'bg-[linear-gradient(135deg,hsl(var(--feature-analytics))_0%,transparent_80%)]',
    },
    commerceIndigo: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-commerce-soft))_0%,transparent_80%)]',
        accentColor: 'bg-[linear-gradient(135deg,hsl(var(--feature-commerce))_0%,transparent_80%)]',
    },
    suppliersTeal: {
        radialColor: 'bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-suppliers-soft))_0%,transparent_80%)]',
        accentColor: 'bg-[linear-gradient(135deg,hsl(var(--feature-suppliers))_0%,transparent_80%)]',
    },
};

const PATTERN_PRESETS = {
    none: '',
    classicGrid: 'absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.secondary.DEFAULT)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.secondary.DEFAULT)_1px,transparent_1px)] bg-[size:20px_20px]',
    dots: 'absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(120,120,180,0.08)_1px,transparent_1px)] bg-[size:18px_18px]',
    diagonalLines: 'absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(120,120,180,0.07)_0_2px,transparent_2px_12px)]',
    vignette: 'absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18)_0%,transparent_70%)]',
    blobs: 'absolute inset-0 -z-5 pointer-events-none overflow-hidden before:absolute before:w-[400px] before:h-[400px] before:rounded-full before:bg-feature-analytics/30 before:blur-3xl before:top-[-100px] before:left-[-100px] after:absolute after:w-[300px] after:h-[300px] after:rounded-full after:bg-feature-users/20 after:blur-2xl after:bottom-[-80px] after:right-[-80px]',
    sparks: 'absolute inset-0 z-10 pointer-events-none',
    'animate-wavyChaos': 'absolute inset-0 z-10 pointer-events-none',
    'animate-rotatingShapes': 'absolute inset-0 z-10 pointer-events-none',
    'animate-isometricMotif': 'absolute inset-0 z-10 pointer-events-none',
};

// Animation class mapping for each pattern
const PATTERN_ANIMATION_CLASSES: Record<string, string> = {
    classicGrid: 'animate-grid-fade',
    dots: 'animate-dots-move',
    diagonalLines: 'animate-lines-slide',
    vignette: 'animate-vignette-fade',
    blobs: 'animate-blob-float',
    sparks: '', // handled by SVG/CSS below
    'animate-wavyChaos': '',
    'animate-rotatingShapes': '',
    'animate-isometricMotif': '',
};

// Tailwind safelist for arbitrary gradients:
// bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-users-soft))_0%,transparent_80%)]
// bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-products-soft))_0%,transparent_80%)]
// bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-analytics-soft))_0%,transparent_80%)]
// bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-commerce-soft))_0%,transparent_80%)]
// bg-[radial-gradient(ellipse_at_center,hsl(var(--feature-suppliers-soft))_0%,transparent_80%)]
// bg-[linear-gradient(135deg,hsl(var(--feature-users))_0%,transparent_80%)]
// bg-[linear-gradient(135deg,hsl(var(--feature-products))_0%,transparent_80%)]
// bg-[linear-gradient(135deg,hsl(var(--feature-analytics))_0%,transparent_80%)]
// bg-[linear-gradient(135deg,hsl(var(--feature-commerce))_0%,transparent_80%)]
// bg-[linear-gradient(135deg,hsl(var(--feature-suppliers))_0%,transparent_80%)]

// Tailwind safelist for arbitrary patterns:
// bg-[linear-gradient(to_right,theme(colors.secondary.DEFAULT)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.secondary.DEFAULT)_1px,transparent_1px)]
// bg-[radial-gradient(circle,rgba(120,120,180,0.08)_1px,transparent_1px)]
// bg-[repeating-linear-gradient(135deg,rgba(120,120,180,0.07)_0_2px,transparent_2px_12px)]
// bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18)_0%,transparent_70%)]
// bg-[url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 20 Q50 40 100 20 T200 20 T300 20 T400 20 V100 H0 Z\' fill=\'%23a5b4fc0d\'/%3E%3C/svg%3E")] bg-repeat bg-[size:200px_60px]
// blobs: before:bg-feature-analytics/30 before:blur-3xl after:bg-feature-users/20 after:blur-2xl

const Background: React.FC<BackgroundProps> = ({
    backgroundStyle = 'default',
    patternStyle = 'classicGrid',
    patternOpacity = 0.6,
    patternAnimation = false,
    performanceMode,
    showGrid,
    showRadial = true,
    showAccent = true,
    radialColor,
    accentColor,
    minHeight = 'min-h-[calc(100vh-64px)]',
    centerContent = true,
    padding = 'p-4',
    className = '',
    title,
    children,
}) => {
    const preset = BG_PRESETS[backgroundStyle] || BG_PRESETS.default;
    const effectiveRadial = preset.radialColor || radialColor || BG_PRESETS.default.radialColor;
    const effectiveAccent = preset.accentColor || accentColor || BG_PRESETS.default.accentColor;
    // Pattern logic: patternStyle takes precedence, fallback to showGrid/classicGrid
    const patternClass = patternStyle && patternStyle !== 'none' ? PATTERN_PRESETS[patternStyle] : (showGrid ? PATTERN_PRESETS.classicGrid : '');
    const animationClass = patternAnimation && patternStyle && patternStyle !== 'none' ? PATTERN_ANIMATION_CLASSES[patternStyle] || '' : '';

    return (
        <div className={clsx('relative', minHeight, padding, className)}>
            {/* Background Layers */}
            <div className='pointer-events-none absolute inset-0 z-0'>
                {showRadial && <div className={clsx('absolute inset-0', effectiveRadial)} aria-hidden="true" />}
                {patternClass && !['animate-wavyChaos', 'animate-rotatingShapes', 'animate-isometricMotif', 'sparks'].includes(patternStyle) && (
                    <div className={clsx(patternClass, animationClass)} aria-hidden="true" style={{ opacity: patternOpacity }} />
                )}
                {/* Animated SVG Patterns */}
                {patternStyle === 'sparks' && (
                    <div className={clsx(patternClass)} aria-hidden="true" style={{ opacity: patternOpacity }}>
                        {/* SVG Lines */}
                        <svg className="absolute animate-spark-line-1" width="120" height="6" style={{ top: '12%', left: '10%' }}><rect x="0" y="2" width="120" height="2" rx="1" fill="rgba(125,180,255,0.18)" /></svg>
                        <svg className="absolute animate-spark-line-2" width="80" height="4" style={{ top: '60%', left: '70%' }}><rect x="0" y="1" width="80" height="2" rx="1" fill="rgba(180,125,255,0.15)" /></svg>
                        <svg className="absolute animate-spark-line-3" width="100" height="5" style={{ top: '40%', left: '40%' }}><rect x="0" y="2" width="100" height="1.5" rx="1" fill="rgba(125,255,180,0.13)" /></svg>
                        {/* SVG Sparks (dots) */}
                        <svg className="absolute animate-spark-dot-1" width="18" height="18" style={{ top: '20%', left: '60%' }}><circle cx="9" cy="9" r="6" fill="rgba(255,255,255,0.18)" /></svg>
                        <svg className="absolute animate-spark-dot-2" width="12" height="12" style={{ top: '70%', left: '30%' }}><circle cx="6" cy="6" r="4" fill="rgba(255,255,255,0.13)" /></svg>
                        <svg className="absolute animate-spark-dot-3" width="24" height="24" style={{ top: '50%', left: '80%' }}><circle cx="12" cy="12" r="8" fill="rgba(255,255,255,0.10)" /></svg>
                    </div>
                )}
                {/* Wavy Chaos Pattern */}
                {patternStyle === 'animate-wavyChaos' && (
                    <div className={clsx(patternClass, 'overflow-hidden')} aria-hidden="true" style={{ opacity: patternOpacity }}>
                        {performanceMode ? (
                            // Performance mode: single static blurred blob
                            <svg className="absolute" width="420" height="420" style={{ top: '10%', left: '10%' }} viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="210" cy="210" rx="160" ry="120" fill="#a5b4fc" fillOpacity="0.28" filter="url(#blurA)" />
                                <defs>
                                    <filter id="blurA"><feGaussianBlur stdDeviation="40" /></filter>
                                </defs>
                            </svg>
                        ) : (
                            <>
                                {/* Apple Liquid Glass style: blurred, animated pastel blobs + soft radial gradient */}
                                <svg className="absolute animate-wavyChaos-A" width="420" height="420" style={{ top: '-8%', left: '-10%' }} viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="210" cy="210" rx="160" ry="120" fill="#a5b4fc" fillOpacity="0.35" filter="url(#blurA)" />
                                    <defs>
                                        <filter id="blurA"><feGaussianBlur stdDeviation="40" /></filter>
                                    </defs>
                                </svg>
                                <svg className="absolute animate-wavyChaos-B" width="320" height="320" style={{ top: '30%', left: '60%' }} viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="160" cy="160" rx="110" ry="90" fill="#fbc2eb" fillOpacity="0.28" filter="url(#blurB)" />
                                    <defs>
                                        <filter id="blurB"><feGaussianBlur stdDeviation="32" /></filter>
                                    </defs>
                                </svg>
                                <svg className="absolute animate-wavyChaos-C" width="260" height="260" style={{ top: '60%', left: '10%' }} viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="130" cy="130" rx="90" ry="70" fill="#c2e9fb" fillOpacity="0.22" filter="url(#blurC)" />
                                    <defs>
                                        <filter id="blurC"><feGaussianBlur stdDeviation="28" /></filter>
                                    </defs>
                                </svg>
                                <svg className="absolute animate-wavyChaos-D" width="180" height="180" style={{ top: '70%', left: '70%' }} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="90" cy="90" rx="60" ry="50" fill="#a1c4fd" fillOpacity="0.18" filter="url(#blurD)" />
                                    <defs>
                                        <filter id="blurD"><feGaussianBlur stdDeviation="18" /></filter>
                                    </defs>
                                </svg>
                                {/* Soft radial gradient overlay */}
                                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, #a5b4fc33 0%, #fbc2eb22 60%, #0f172a 100%)', zIndex: 1 }} />
                            </>
                        )}
                    </div>
                )}
                {/* Rotating Shapes Pattern */}
                {patternStyle === 'animate-rotatingShapes' && (
                    <div className={clsx(patternClass)} aria-hidden="true" style={{ opacity: patternOpacity }}>
                        {performanceMode ? (
                            // Performance mode: single static blurred blob
                            <svg className="absolute" width="180" height="180" style={{ top: '30%', left: '40%' }} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="90" cy="90" rx="60" ry="50" fill="#a1c4fd" fillOpacity="0.18" filter="url(#blurD)" />
                                <defs>
                                    <filter id="blurD"><feGaussianBlur stdDeviation="18" /></filter>
                                </defs>
                            </svg>
                        ) : (
                            <>
                                <svg className="absolute animate-rotatingShapes-A" width="48" height="48" style={{ top: '15%', left: '20%' }} viewBox="0 0 48 48"><polygon points="24,4 44,44 4,44" fill="rgba(125,180,255,0.18)" /></svg>
                                <svg className="absolute animate-rotatingShapes-B" width="40" height="40" style={{ top: '60%', left: '70%' }} viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="6" fill="rgba(180,125,255,0.13)" /></svg>
                                <svg className="absolute animate-rotatingShapes-C" width="56" height="56" style={{ top: '50%', left: '40%' }} viewBox="0 0 56 56"><polygon points="28,6 50,50 6,50" fill="rgba(125,255,180,0.10)" /></svg>
                            </>
                        )}
                    </div>
                )}
                {/* Isometric Motif Pattern */}
                {patternStyle === 'animate-isometricMotif' && (
                    <div className={clsx(patternClass)} aria-hidden="true" style={{ opacity: patternOpacity }}>
                        {performanceMode ? (
                            // Performance mode: single static blurred blob
                            <svg className="absolute" width="120" height="120" style={{ top: '50%', left: '60%' }} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="60" cy="60" rx="40" ry="30" fill="#fbc2eb" fillOpacity="0.18" filter="url(#blurE)" />
                                <defs>
                                    <filter id="blurE"><feGaussianBlur stdDeviation="12" /></filter>
                                </defs>
                            </svg>
                        ) : (
                            <>
                                <svg className="absolute animate-isometricMotif-A" width="60" height="60" style={{ top: '20%', left: '15%' }} viewBox="0 0 60 60"><rect x="10" y="10" width="40" height="40" rx="8" fill="rgba(125,180,255,0.18)" /><rect x="20" y="20" width="20" height="20" rx="4" fill="rgba(255,255,255,0.10)" /></svg>
                                <svg className="absolute animate-isometricMotif-B" width="48" height="48" style={{ top: '65%', left: '60%' }} viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="6" fill="rgba(180,125,255,0.13)" /><rect x="16" y="16" width="16" height="16" rx="3" fill="rgba(255,255,255,0.08)" /></svg>
                                <svg className="absolute animate-isometricMotif-C" width="40" height="40" style={{ top: '45%', left: '80%' }} viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="5" fill="rgba(125,255,180,0.10)" /><rect x="12" y="12" width="16" height="16" rx="2" fill="rgba(255,255,255,0.07)" /></svg>
                            </>
                        )}
                    </div>
                )}
                {showAccent && <div className={clsx('absolute inset-0 -z-20 opacity-20', effectiveAccent)} aria-hidden="true" />}
            </div>
            {/* Content Container */}
            <div className={clsx('relative z-10', centerContent && `${minHeight} flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8`)}>
                {title && (
                    <h1 className="mb-6 text-2xl font-bold text-center text-feature-analytics drop-shadow-sm select-none">
                        {title}
                    </h1>
                )}
                {children}
            </div>
        </div>
    );
};

/**
 * Add these to your global CSS for pattern animations:
 *
 * @keyframes grid-fade {
 *   0%, 100% { opacity: 0.7; }
 *   50% { opacity: 0.3; }
 * }
 * .animate-grid-fade { animation: grid-fade 8s ease-in-out infinite; }
 *
 * @keyframes dots-move {
 *   0%, 100% { background-position: 0 0, 0 0; }
 *   50% { background-position: 20px 10px, 10px 20px; }
 * }
 * .animate-dots-move { animation: dots-move 10s linear infinite; }
 *
 * @keyframes lines-slide {
 *   0%, 100% { background-position: 0 0; }
 *   50% { background-position: 40px 40px; }
 * }
 * .animate-lines-slide { animation: lines-slide 12s linear infinite; }
 *
 * @keyframes vignette-fade {
 *   0%, 100% { opacity: 0.5; }
 *   50% { opacity: 0.8; }
 * }
 * .animate-vignette-fade { animation: vignette-fade 9s ease-in-out infinite; }
 *
 * @keyframes blob-float {
 *   0%, 100% { transform: translate(0, 0) scale(1); }
 *   50% { transform: translate(40px, -30px) scale(1.08); }
 * }
 * .animate-blob-float::before { animation: blob-float 12s ease-in-out infinite; }
 * .animate-blob-float::after { animation: blob-float 14s ease-in-out infinite reverse; }
 *
 * // Sparks/Lines Animations
 * @keyframes spark-line-1 { 0%,100%{transform:translateX(0);} 50%{transform:translateX(40px);} }
 * @keyframes spark-line-2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-30px);} }
 * @keyframes spark-line-3 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }
 * .animate-spark-line-1 { animation: spark-line-1 7s ease-in-out infinite; }
 * .animate-spark-line-2 { animation: spark-line-2 9s ease-in-out infinite; }
 * .animate-spark-line-3 { animation: spark-line-3 8s ease-in-out infinite; }
 *
 * @keyframes spark-dot-1 { 0%,100%{opacity:0.7;transform:translateY(0);} 50%{opacity:1;transform:translateY(-18px);} }
 * @keyframes spark-dot-2 { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
 * @keyframes spark-dot-3 { 0%,100%{opacity:0.6;transform:translateX(0);} 50%{opacity:1;transform:translateX(22px);} }
 * .animate-spark-dot-1 { animation: spark-dot-1 6s ease-in-out infinite; }
 * .animate-spark-dot-2 { animation: spark-dot-2 8s ease-in-out infinite; }
 * .animate-spark-dot-3 { animation: spark-dot-3 7s ease-in-out infinite; }
 *
 * // Wavy Chaos Animations
 * @keyframes wavy-1 { 0%,100%{transform:translateX(0);} 50%{transform:translateX(40px);} }
 * @keyframes wavy-2 { 0%,100%{transform:translateX(0);} 50%{transform:translateX(-30px);} }
 * @keyframes wavy-3 { 0%,100%{transform:translateX(0);} 50%{transform:translateX(20px);} }
 * .animate-wavy-1 { animation: wavy-1 8s ease-in-out infinite; }
 * .animate-wavy-2 { animation: wavy-2 10s ease-in-out infinite; }
 * .animate-wavy-3 { animation: wavy-3 12s ease-in-out infinite; }
 *
 * // Rotating Shapes Animations
 * @keyframes rotate-shape-1 { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
 * @keyframes rotate-shape-2 { 0%{transform:rotate(0deg);} 100%{transform:rotate(-360deg);} }
 * @keyframes rotate-shape-3 { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
 * .animate-rotate-shape-1 { animation: rotate-shape-1 14s linear infinite; }
 * .animate-rotate-shape-2 { animation: rotate-shape-2 18s linear infinite; }
 * .animate-rotate-shape-3 { animation: rotate-shape-3 16s linear infinite; }
 *
 * // Isometric Motif Animations
 * @keyframes iso-tile-1 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
 * @keyframes iso-tile-2 { 0%,100%{transform:scale(1);} 50%{transform:scale(0.92);} }
 * @keyframes iso-tile-3 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
 * .animate-iso-tile-1 { animation: iso-tile-1 9s ease-in-out infinite; }
 * .animate-iso-tile-2 { animation: iso-tile-2 11s ease-in-out infinite; }
 * .animate-iso-tile-3 { animation: iso-tile-3 13s ease-in-out infinite; }
 */

export default Background; 
